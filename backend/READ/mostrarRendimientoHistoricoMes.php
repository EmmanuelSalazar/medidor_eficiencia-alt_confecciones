<?php
require_once '../config/baseDeDatos.php';
require_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Parámetros de fecha
    $fechaFin = $_GET['fecha_fin'] ?? date('Y-m-d');
    $fechaInicio = $_GET['fecha_inicio'] ?? date('Y-m-d', strtotime('-30 days'));
    
    // Obtener todos los módulos existentes
    $modulosQuery = "SELECT DISTINCT modulo FROM operarios WHERE activo = 1";
    $modulosResult = $mysqli->query($modulosQuery);
    $modulos = [];
    while($row = $modulosResult->fetch_assoc()) {
        $modulos[] = $row['modulo'];
    }

    // Generar todas las fechas del rango
    $sqlFechas = "
        SELECT DATE('$fechaInicio') + INTERVAL a.a DAY AS fecha
        FROM (
            SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
            UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
            UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
            UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
            UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
            UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23
            UNION ALL SELECT 24 UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27
            UNION ALL SELECT 28 UNION ALL SELECT 29
        ) AS a
        WHERE DATE('$fechaInicio') + INTERVAL a.a DAY <= '$fechaFin'
    ";

    // Consulta principal
    $sql = "
        SELECT 
            dates.fecha,
            modulos.modulo,
            COALESCE(SUM(rp.unidadesProducidas), 0) AS TotalUnidadesProducidas,
            COALESCE(SUM(rp.MetaPorEficiencia), 0) AS TotalMetaUnidades
        FROM ($sqlFechas) AS dates
        CROSS JOIN (SELECT modulo FROM operarios WHERE activo = 1 GROUP BY modulo) AS modulos
        LEFT JOIN registro_produccion rp 
            ON DATE(rp.fecha) = dates.fecha
            AND rp.modulo = modulos.modulo
            AND rp.rol = 1  -- Filtro de rol aplicado aquí
        GROUP BY dates.fecha, modulos.modulo
        ORDER BY dates.fecha ASC, modulos.modulo
    ";

    $stmt = $mysqli->prepare($sql);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $datos = [];
        while($row = $result->fetch_assoc()) {
            $datos[] = [
                'fecha' => $row['fecha'],
                'modulo' => (int)$row['modulo'],
                'TotalUnidadesProducidas' => (int)$row['TotalUnidadesProducidas'],
                'TotalMetaUnidades' => (int)$row['TotalMetaUnidades']
            ];
        }
    header('Content-Type: application/json');
    echo json_encode([
        'ok' => true,
        'respuesta' => $datos
    ], JSON_PRETTY_PRINT);
    } else {
        $respuesta = [
            'ok' => false,
            'respuesta' => 'Error en la consulta: ' . $stmt->error
        ];
        http_response_code(500);
        echo json_encode($respuesta, true);
    }
} else {
    $respuesta = [
        'ok' => false,
        'respuesta' => 'Metodo no permitido'
    ];
    http_response_code( 405);
    echo json_encode($respuesta, true);
}
?>