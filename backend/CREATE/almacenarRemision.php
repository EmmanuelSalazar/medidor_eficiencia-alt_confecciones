<?php 
    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $datos = json_decode(file_get_contents('php://input'), true);
        $clientID = (int)$datos['clientID'] ?? NULL;
        $odpInfo = $datos['odpInfo']?? NULL;
        $observaciones = $datos['observaciones'] ?? NULL;
        $fecha = date('Y-m-d');
        // CALCULAR # DE REMISIÓN
        $sql = "SELECT numeroDeRemision FROM bodega_remision ORDER BY rem_id DESC LIMIT 1";
        $stmt = $mysqli->prepare($sql);
        if($stmt->execute()){
            $result = $stmt->get_result();
            $result = $result->fetch_all(MYSQLI_ASSOC);
            $numeroDeRemision = (int)$result[0]['numeroDeRemision'] + 1;
        }
        // REGISTRAR TODAS LAS REMISIONES
        foreach($odpInfo as $odp){
            $odpID = (int)$odp['odp']?? NULL;
            $unidadesDespachadas = (int)$odp['unidades']?? NULL;
            // ALMACENAR LA REMISION
            $sql = "INSERT INTO bodega_remision (client_id, odp_id, unidadesDespachadas, observaciones, numeroDeRemision) VALUES (?, ?, ?, ?, ?)";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("iiisi", $clientID, $odpID, $unidadesDespachadas, $observaciones, $numeroDeRemision);
            if($stmt->execute()){
                // ACTUALIZAR EL ESTADO DE LA ORDEN DE PRODUCCION
                $sql = "SELECT * FROM bodega WHERE odp_id = ?";
                $stmt = $mysqli->prepare($sql); 
                $stmt->bind_param("i", $odpID);
                if($stmt->execute()) {
                    $result = $stmt->get_result();
                    $result = $result->fetch_all(MYSQLI_ASSOC);
                    $unidadesFaltantes = (int)$result[0]['cantidad_producida'];
                        if($unidadesFaltantes <= 0){
                            $sql = 'UPDATE bodega SET estado = 2 WHERE odp_id = ?';
                            $stmt = $mysqli->prepare($sql);
                            $stmt->bind_param("i", $odpID);
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
                                   'respuesta' => 'Error al actualizar el estado de la orden de producción'
                                ];
                                http_response_code(500);
                                echo json_encode($respuesta);
                            }
                        } else {
                            $respuesta = [
                                'ok' => true,
                               'respuesta' => 'Remisión almacenada correctamente'
                            ];
                            http_response_code(200);
                            echo json_encode($respuesta);
                        }
                } else {
                    $respuesta = [
                        'ok' => false,
                      'respuesta' => 'Error al obtener la información de la orden de producción'
                    ];
                    http_response_code(500);
                    echo json_encode($respuesta);
                }
            } else {
                $respuesta = [
                    'ok' => false,
                    'respuesta' => 'Error al almacenar la remisión'
                ];
                http_response_code(500);
                echo json_encode($respuesta);
            }
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