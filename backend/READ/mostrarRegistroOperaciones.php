<?php 
require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';
require_once '../config/cortes.php';
$respuesta = [
    "ok" => false,
    "respuesta" => []
];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Obtener los parámetros de la solicitud
    $modulo = $_GET['modulo'] ?? null; // Módulo (opcional)
    $fechaInicio = $_GET['fecha_inicio'] ?? null; // Fecha inicial (opcional)
    $fechaFin = $_GET['fecha_fin'] ?? null; // Fecha final (opcional)
    $horaInicio = $_GET['hora_inicio'] ?? null; // Hora inicial (opcional)
    $horaFin = $_GET['hora_fin'] ?? null; // Hora final (opcional)
    $rol = $_GET['rol'] ?? null; // Rol (opcional, por defecto es false)
    $tipo = $_GET['tipo']?? null; // Tipo (opcional, por defecto es false)
    // Validar el módulo
    if (!empty($modulo) && is_numeric($modulo)) {
        $moduloFiltro = intval($modulo);
    } else {
        $moduloFiltro = null; // No filtrar por módulo si no se proporciona un valor válido
    }
    if ($tipo) {
        // Obtener el rango de fechas de corte
        $fechasDeCortes = explode('-', $fechaInicio);
        $fechasDeCortes = obtenerCorte($fechasDeCortes);
        $fechaInicio = $fechasDeCortes[0];
        $fechaFin = $fechasDeCortes[1];
    }
    // Validar las fechas
    if (!empty($fechaInicio) && !strtotime($fechaInicio)) {
        $respuesta["ok"] = false;
        $respuesta["respuesta"] = "La fecha de inicio no es válida.";
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
        exit();
    }

    if (!empty($fechaFin) && !strtotime($fechaFin)) {
        $respuesta["ok"] = false;
        $respuesta["respuesta"] = "La fecha final no es válida.";
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
        exit();
    }

    // Validar las horas
    if (!empty($horaInicio) && !preg_match('/^(?:\d{1,2}):(?:\d{2})$/', $horaInicio)) {
        $respuesta["ok"] = false;
        $respuesta["respuesta"] = "La hora de inicio no es válida. Formato esperado: HH:mm";
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
        exit();
    }

    if (!empty($horaFin) && !preg_match('/^(?:\d{1,2}):(?:\d{2})$/', $horaFin)) {
        $respuesta["ok"] = false;
        $respuesta["respuesta"] = "La hora final no es válida. Formato esperado: HH:mm";
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
        exit();
    }

    // Construir la consulta SQL dinámicamente
    $sql = "
        SELECT 
            regProd_id,
            RP.fecha,
            RP.ref_id,
            RP.modulo,
            RP.adicionales as Comentarios,
            horario,
            rol,
            O.nombre AS NombreOperario,
            R.referencia AS Referencia,
            RP.unidadesProducidas,
            RP.MetaPorEficiencia AS MetaAjustada
        FROM 
            registro_produccion RP
        JOIN 
            operarios O ON RP.op_id = O.op_id
        JOIN 
            referencias R ON RP.ref_id = R.ref_id
        WHERE 
            1=1
    ";

    // Agregar filtro por módulo si se proporciona
    if ($moduloFiltro) {
        $sql .= " AND R.modulo = $moduloFiltro";
    }

    // Agregar filtro por rango de fechas si se proporcionan
    if ($fechaInicio && $fechaFin) {
        $sql .= " AND RP.fecha BETWEEN '$fechaInicio 00:00:00' AND '$fechaFin 23:59:59'";
    } elseif ($fechaInicio) {
        $sql .= " AND RP.fecha >= '$fechaInicio 00:00:00'";
    } elseif ($fechaFin) {
        $sql .= " AND RP.fecha <= '$fechaFin 23:59:59'";
    }
    // Agregar filtro por rol si se proporciona
    if ($rol) {
        $sql .= " AND RP.rol = 1";
    }
    // Agregar filtro por rango de horas si se proporcionan
    if ($horaInicio && $horaFin) {
        $sql .= " AND TIME(RP.fecha) BETWEEN '$horaInicio:00' AND '$horaFin:59'";
    } elseif ($horaInicio) {
        $sql .= " AND TIME(RP.fecha) >= '$horaInicio:00'";
    } elseif ($horaFin) {
        $sql .= " AND TIME(RP.fecha) <= '$horaFin:59'";
    }

    $sql .= " ORDER BY regProd_id DESC";

    // Ejecutar la consulta
    $stmt = $mysqli->prepare($sql);
    if (!$stmt) {
        $respuesta["ok"] = false;
        $respuesta["respuesta"] = "Error al preparar la consulta: " . $mysqli->error;
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
        exit();
    }

    $stmt->execute();
    $result = $stmt->get_result();

    // Procesar los resultados
    if ($result->num_rows > 0) {
        $datosCompuestos = [];
        while ($row = $result->fetch_assoc()) {
            // Calcular eficiencia
            if ($row["MetaAjustada"] > 0.01) {
                // Solo calcular eficiencia si MetaAjustada es mayor que 0
                $eficiencia = round(($row["unidadesProducidas"] / round($row["MetaAjustada"])) * 100) . "%";
            } else {
                // Si MetaAjustada es 0 o NULL, establecer eficiencia en "0%"
                $eficiencia = "0%";
            }
            
            $datosCompuestos[] = [
                "regProd_id" => $row["regProd_id"],
                "ref_id" => $row["ref_id"],
                "horario" => $row["horario"],
                "reg_id" => $row["regProd_id"],
                "nombre_operario" => $row["NombreOperario"],
                "referencia" => $row["Referencia"],
                "fecha" => $row["fecha"],
                "unidadesProducidas" => $row["unidadesProducidas"],
                "metaAjustada" => round($row["MetaAjustada"]),
                "metaDecimal" => (float)$row['MetaAjustada'],
                "eficiencia" => $eficiencia,
                "modulo" => $row['modulo'],
                "comentarios" => $row['Comentarios'] ?? "N/A",
                "rol" => $row['rol'] ?? 0,
            ];
        }
        $respuesta["ok"] = true;
        $respuesta["respuesta"] = $datosCompuestos;
        
    } else {
        $respuesta["ok"] = false;
        $respuesta["respuesta"] = "No se encontraron resultados.";
    }

    // Devolver la respuesta como JSON
    echo json_encode($respuesta, JSON_PRETTY_PRINT);

    // Cerrar la conexión
    $stmt->close();
    $mysqli->close();
} else {
    http_response_code(405); 
    $respuesta["ok"] = false;
    $respuesta["respuesta"] = "Método no permitido.";
    echo json_encode($respuesta, JSON_PRETTY_PRINT);
}
?>