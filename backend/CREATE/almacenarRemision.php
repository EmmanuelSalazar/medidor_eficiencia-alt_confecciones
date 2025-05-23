<?php 
    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $datos = json_decode(file_get_contents('php://input'), true);
        $clientID = (int)$datos['clientID'] ?? NULL;
        $odpInfo = $datos['odpInfo']?? NULL;
        $observaciones = $datos['observaciones'] ?? NULL;
        $numeroRemision = $datos['remision'] ?? NULL;
        $baja = $datos['baja']?? NULL;
        $fecha = date('Y-m-d');
        // VERIFICAR SI NECESITA UN # Y CALCULAR # DE REMISIÓN
        if(empty($numeroRemision)){
            $sql = "SELECT numeroDeRemision FROM bodega_remision";
            $stmt = $mysqli->prepare($sql);
            if($baja === 1) {
                $bajas = 1;
                $sql .= " WHERE bajas = 1";
            } else {
                $bajas = 0;
                $sql .= " WHERE bajas = 0";
            }
            $sql .= " ORDER BY rem_id DESC LIMIT 1";
            $stmt = $mysqli->prepare($sql);
            if($stmt->execute()){
            $result = $stmt->get_result();
            $result = $result->fetch_all(MYSQLI_ASSOC);
            $numeroDeRemision = (int)$result[0]['numeroDeRemision'] + 1;
            echo $bajas;

        }
        } else {
            $numeroDeRemision = $numeroRemision;
        }
        // REGISTRAR TODAS LAS REMISIONES
        foreach($odpInfo as $odp){
            $odpID = (int)$odp['odp']?? NULL;
            $unidadesDespachadas = (int)$odp['unidades']?? NULL;
            $segundas = (int)$odp['segundas']?? 0;
            // ALMACENAR LA REMISION
            $sql = "INSERT INTO bodega_remision (client_id, odp_id, unidadesDespachadas, segundasDespachadas, observaciones, numeroDeRemision, bajas) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("iiiisii", $clientID, $odpID, $unidadesDespachadas, $segundas, $observaciones, $numeroDeRemision, $bajas);
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