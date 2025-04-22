<?php
require_once '../config/baseDeDatos.php';
require_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Parámetros de fecha (últimos 90 días)
    $fechaFin = $_GET['fecha_fin'] ?? date('Y-m-d');
    $fechaInicio = $_GET['fecha_inicio'] ?? date('Y-m-d', strtotime('-90 days'));
    
    // 2. Generar todas las fechas del rango (90 días)
    $sqlFechas = "
        SELECT DATE('$fechaInicio') + INTERVAL (t2.a*10 + t1.a) DAY AS fecha
        FROM 
            (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 
             UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 
             UNION SELECT 8 UNION SELECT 9) t1,
            (SELECT 0 AS a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 
             UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 
             UNION SELECT 8 UNION SELECT 9) t2
        WHERE DATE('$fechaInicio') + INTERVAL (t2.a*10 + t1.a) DAY <= '$fechaFin'
        ORDER BY fecha
    ";

    // 3. Consulta principal
    $sql = "
        SELECT 
            dates.fecha,
            modulos.modulo,
            COALESCE(SUM(rp.unidadesProducidas), 0) AS TotalUnidadesProducidas,
            COALESCE(SUM(rp.MetaPorEficiencia), 0) AS TotalMetaUnidades
        FROM ($sqlFechas) AS dates
        CROSS JOIN (
            SELECT DISTINCT modulo 
            FROM operarios 
            WHERE activo = 1
        ) AS modulos
        LEFT JOIN registro_produccion rp 
            ON DATE(rp.fecha) = dates.fecha
            AND rp.modulo = modulos.modulo
            AND rp.rol = 1  -- Filtro por rol
        GROUP BY dates.fecha, modulos.modulo
        ORDER BY dates.fecha ASC, modulos.modulo
    ";

    // 4. Ejecución y respuesta
    $result = $mysqli->query($sql);
    
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
}
?>