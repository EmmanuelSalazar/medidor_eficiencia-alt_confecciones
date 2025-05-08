<?php 
    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';
    
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $sql = 'SELECT b.odp_id, b.orden_produccion, b.talla, b.color, b.cantidad, b.estado, b.fecha_inicio, b.fecha_final, b.cantidad_producida, r.referencia, r.modulo, ROUND(b.cantidad_producida / m.meta, 1) AS DiasDeTrabajo FROM bodega b JOIN referencias r ON b.ref_id = r.ref_id JOIN metas m ON b.ref_id = m.ref_id';
        $stmt = $mysqli->prepare($sql);
        if($stmt->execute()) {
            $resultado = $stmt->get_result();
            $bodega = $resultado->fetch_all(MYSQLI_ASSOC);
            $respuesta = [
                'ok' => true,
                'respuesta' => $bodega
            ];
            http_response_code(200);
            echo json_encode($respuesta, true);
        } else {
            $respuesta = [
                'ok' => false,
               'respuesta' => 'Error al obtener datos'
            ];
            http_response_code(500);
            echo json_encode($respuesta, true);
        }
        
    } else {
        $respuesta = [
            'ok' => false,
          'respuesta' => 'Método no permitido'
        ];
        http_response_code(405);
        echo json_encode($respuesta, true);
    }
?>