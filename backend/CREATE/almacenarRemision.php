<?php 
    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $datos = json_decode(file_get_contents('php://input'), true);
        $clientID = (int)$datos['clientID'] ?? NULL;
        $odpID = (int)$datos['odpID'] ?? NULL ;
        $unidadesDespachadas = (int)$datos['unidadesDespachadas'] ?? NULL;
        $observaciones = $datos['observaciones'] ?? NULL;
        $fecha = date('Y-m-d');

        if(!$clientID || !$odpID || !$unidadesDespachadas){
            $respuesta = [
                'ok' => false,
                'respuesta' => 'Faltan datos'
            ];
            echo json_encode($respuesta);
            exit;
        }

        $sql = "INSERT INTO bodega_remision (client_id, odp_id, unidadesDespachadas, observaciones) VALUES (?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("iiis", $clientID, $odpID, $unidadesDespachadas, $observaciones);
        if($stmt->execute()){
            $respuesta = [
                'ok' => true,
                'respuesta' => 'Remisión almacenada correctamente'
            ];
            http_response_code(200);
            echo json_encode($respuesta);
        } else {
            $respuesta = [
                'ok' => false,
                'respuesta' => 'Error al almacenar la remisión'
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