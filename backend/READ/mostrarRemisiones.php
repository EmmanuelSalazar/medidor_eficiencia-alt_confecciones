<?php 
    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';

    if($_SERVER['REQUEST_METHOD'] == 'GET'){
        $sql = "SELECT
                bm.rem_id AS id,
                b.orden_produccion,
                bc.nombre AS nombreCliente,
                bm.unidadesDespachadas,
                COALESCE(bm.observaciones, 'N/A') AS observaciones,
                bm.fecha,
                r.referencia
            FROM
                `bodega_remision` bm
            JOIN bodega_clientes bc ON
                bm.client_id = bc.client_id
            INNER JOIN bodega b ON
                bm.odp_id = b.odp_id
            JOIN referencias r ON
                b.ref_id = r.ref_id
            ORDER BY
                fecha
            DESC
                ";
        $stmt = $mysqli->prepare($sql);
        if ($stmt->execute()) {
            $resultado = $stmt->get_result();
            $respuesta = [
                'ok' => true,
                'respuesta' => $resultado->fetch_all(MYSQLI_ASSOC)
            ];
            http_response_code(200);
            echo json_encode($respuesta);
        } else {
            $respuesta = [
                'ok' => false,
               'respuesta' => 'Error al ejecutar la consulta'
            ];
            http_response_code(500);
            echo json_encode($respuesta);
        }
    } else {
        $respuesta = [
            'ok' => false,
            'respuesta' => 'Método no permitido'
        ];
        http_response_code(405);
        echo json_encode($respuesta);
    }


?>