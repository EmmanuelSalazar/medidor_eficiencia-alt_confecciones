<?php 

require_once '../config/baseDeDatos.php';
require_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operario = $_GET['operario'] ?? null;
    $fechaInicio = $_GET['fecha_inicio'] ?? null;
    $fechaFin = $_GET['fecha_fin'] ?? null;

    if(!$operario || !$fechaInicio || !$fechaFin) {
        $respuesta = [
            'ok' => false,
            'respuesta' => "Faltan parámetros."
        ];
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
        exit();
    }

    $sql = "SELECT
                rp.fecha,
                o.nombre,
                SUM(unidadesProducidas) AS unidades_producidas,
                ROUND(SUM(MetaPorEficiencia), 0) AS unidades_por_producir,
                ROUND((SUM(unidadesProducidas) / SUM(MetaPorEficiencia)) * 100, 2) AS eficiencia
            FROM
                `registro_produccion` rp
            JOIN operarios o ON
                rp.op_id = o.op_id
            WHERE
                rp.op_id = ? AND DATE(fecha) BETWEEN ? AND ?
            GROUP BY
                DATE(fecha)";

    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("sss", $operario, $fechaInicio, $fechaFin);
    if($stmt->execute()) {
        $resultado = $stmt->get_result();
        $respuesta["ok"] = true;
        $respuesta["respuesta"] = $resultado->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        $mysqli->close();
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
    exit();
    }
    
}


?>