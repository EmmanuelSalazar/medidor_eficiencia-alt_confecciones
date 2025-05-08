<?php 

    include_once '../config/baseDeDatos.php';
    include_once '../config/cors.php';

    if($_SERVER['REQUEST_METHOD'] == 'PUT'){
        $datos = json_decode(file_get_contents('php://input'), true);
        $odpID = (int)$datos['odpID']?? NULL;
        $odp = $datos['odp']?? NULL;
        $talla = $datos['talla'] ?? NULL;
        $color = $datos['color'] ?? NULL;
        $estado = (int)$datos['estado']?? NULL;
        if (empty($odp) || empty($talla) || empty($color)) {
            $response =[
                'ok' => 'false',
                'respuesta' => 'Datos incompletos'
            ];
            echo json_encode($response);
            exit();
        }
        
        $sql = "UPDATE bodega SET orden_produccion = ?, talla = ?, color = ?, estado = ? WHERE odp_id = ?";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("ssssi", $odp, $talla, $color, $estado, $odpID);
        if($stmt->execute()){
            // Actualizar el estado de las otras ordenes de produccion del mismo modulo
            if($estado === 1) {
                $sql = "SELECT modulo FROM bodega WHERE odp_id = ?";
                $stmt = $mysqli->prepare($sql);
                $stmt->bind_param("i", $odpID);
                if($stmt->execute()){
                    $result = $stmt->get_result();
                    $row = $result->fetch_assoc();
                    $modulo = (int)$row['modulo'];
                    $sql = "UPDATE bodega SET estado = 4 WHERE modulo = ? AND estado = 1 AND odp_id <> ?";
                    $stmt = $mysqli->prepare($sql);
                    $stmt->bind_param("ii", $modulo, $odpID);
                    if($stmt->execute()) {  
                        $stmt->close();
                    } else {
                        $responde = [
                            'ok' => 'false',
                        'respuesta' => 'No se pudo actualizar'
                        ];
                        http_response_code(500);
                        echo json_encode($responde);
                    }   
                } else {
                    $responde = [
                        'ok' => 'false',
                      'respuesta' => 'No se pudo actualizar'
                    ];
                    http_response_code(500);
                    echo json_encode($responde);
                }
                
            } else {
                $responde = [
                    'ok' => 'true',
                    'respuesta' => 'Datos actualizados'
                ];
                http_response_code(200);
                echo json_encode($responde);
            }
            
        } else {
            $responde = [
                'ok' => 'false',
               'respuesta' => 'No se pudo actualizar'
            ];
            http_response_code(500);
            echo json_encode($responde);
        }
    } else {
        $responde = [
            'ok' => 'false',
          'respuesta' => 'Metodo no permitido'
        ];
        http_response_code(405);
        echo json_encode($responde);
    }

?>