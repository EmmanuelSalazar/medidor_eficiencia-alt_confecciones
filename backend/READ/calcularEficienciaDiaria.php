<?php
require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';
require_once '../config/cortes.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Obtener los parámetros de la solicitud
    $modulo = $_GET['modulo'] ?? null; // Módulo (opcional, ahora de registro_produccion)
    $fechaFiltro = $_GET['fecha'] ?? date('Y-m-d'); // Fecha (por defecto, hoy)
    $operariosFiltro = $_GET['operarios'] ?? null; // Lista de operarios (opcional)

    // Validar las fechas de corte
    if (empty($fechaCorteInicial) || empty($fechaCorteFinal)) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Las fechas de corte (fechaCorteInicial y fechaCorteFinal) son obligatorias.'
        ]);
        exit();
    }

    // Validar el módulo
    if (!empty($modulo) && is_numeric($modulo)) {
        $moduloFiltro = intval($modulo);
    } else {
        $moduloFiltro = null; // No filtrar por módulo si no es válido
    }

    // Validar los operarios
    $operariosArray = [];
    if (!empty($operariosFiltro)) {
        $operarios = explode(',', $operariosFiltro);
        foreach ($operarios as $op_id) {
            if (is_numeric($op_id)) {
                $operariosArray[] = intval($op_id);
            }
        }
    }

    // Construir la consulta SQL dinámicamente
    $sql = "
        SELECT
            RP.op_id AS ID_Operario,
            O.calculadorFinal AS CalculadorFinal,
            DATE(RP.fecha) AS Fecha,
            O.nombre AS NombreOperario,
            RP.modulo AS Modulo, -- Cambio: Usar modulo de registro_produccion
            SUM(RP.unidadesProducidas) AS TotalUnidadesProducidas,
            SUM(RP.MetaPorEficiencia) AS TotalMetaPorEficiencia,
            CASE 
                WHEN SUM(RP.MetaPorEficiencia) = 0 THEN 0
                ELSE ROUND((SUM(RP.unidadesProducidas) / SUM(RP.MetaPorEficiencia)) * 100, 2)
            END AS EficienciaGeneral,
            IFNULL(EficienciaQuincenal.eficiencia, 0) AS EficienciaQuincenal -- Agregar eficiencia del período específico
        FROM
            registro_produccion RP
        JOIN
            operarios O ON RP.op_id = O.op_id
        LEFT JOIN (
            SELECT
                rp.op_id,
                ROUND((SUM(rp.unidadesProducidas) / SUM(rp.MetaPorEficiencia)) * 100, 1) AS eficiencia
            FROM
                registro_produccion rp
            WHERE
                rp.fecha BETWEEN ? AND ? -- Filtrar por el rango de fechas especificado
            GROUP BY
                rp.op_id
        ) AS EficienciaQuincenal ON RP.op_id = EficienciaQuincenal.op_id
        WHERE
            DATE(RP.fecha) = ?
    ";

    // Agregar filtro por módulo (ahora de registro_produccion)
    if ($moduloFiltro) {
        $sql .= " AND RP.modulo = ?"; // Cambio: RP.modulo en lugar de R.modulo
    }

    // Agregar filtro por operarios
    if (!empty($operariosArray)) {
        $placeholders = implode(',', array_fill(0, count($operariosArray), '?'));
        $sql .= " AND O.op_id IN ($placeholders)";
    }

    $sql .= "
        GROUP BY
            RP.op_id, O.nombre, RP.modulo -- Agrupar por operario y módulo
        ORDER BY
            EficienciaGeneral DESC;
    ";

    // Preparar la consulta
    $stmt = $mysqli->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Error en la consulta SQL: ' . $mysqli->error
        ]);
        exit();
    }

    // Enlazar parámetros
    $types = 'sss'; // Tipos para las fechas de corte y la fecha principal
    $params = [$fechaCorteInicial, $fechaCorteFinal, $fechaFiltro];

    if ($moduloFiltro) {
        $types .= 'i'; // Tipo para el módulo (integer)
        $params[] = $moduloFiltro;
    }

    if (!empty($operariosArray)) {
        $types .= str_repeat('i', count($operariosArray)); // Tipos para los operarios
        $params = array_merge($params, $operariosArray);
    }

    // Enlazar parámetros dinámicamente
    try {
        $stmt->bind_param($types, ...$params);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Error al enlazar parámetros: ' . $e->getMessage()
        ]);
        exit();
    }

    // Ejecutar y procesar resultados
    $stmt->execute();
    $result = $stmt->get_result();

    $datosCompuestos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $eficiencia = $row["TotalMetaPorEficiencia"] > 0.01
                ? round(($row["TotalUnidadesProducidas"] / $row["TotalMetaPorEficiencia"]) * 100) . "%"
                : "0%";
            $eficienciaInt = $row["TotalMetaPorEficiencia"] > 0.01
                ? round(($row["TotalUnidadesProducidas"] / $row["TotalMetaPorEficiencia"]) * 100, 1)
                : 0;

            $datosCompuestos[] = [
                "id_operario" => $row["ID_Operario"],
                "calculador_final" => $row["CalculadorFinal"],
                "nombre_operario" => $row["NombreOperario"],
                "fecha" => $row["Fecha"],
                "modulo" => $row["Modulo"],
                "total_unidades_producidas" => $row["TotalUnidadesProducidas"],
                "total_meta_eficiencia" => round($row["TotalMetaPorEficiencia"]),
                "eficiencia" => $eficiencia,
                "eficiencia_int" => $eficienciaInt,
                "eficiencia_quincenal" => $row["EficienciaQuincenal"] // Agregar eficiencia del período específico
            ];
        }
    }

    // Respuesta JSON
    echo json_encode([
        "ok" => true,
        "respuesta" => $datosCompuestos
    ], JSON_PRETTY_PRINT);

    // Cerrar conexión
    $stmt->close();
    $mysqli->close();
} else {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'respuesta' => 'Método no permitido'
    ]);
}
?>