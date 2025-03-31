<?php 
    require_once '../config/cors.php';
    require_once '../config/baseDeDatos.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // RECIBIR Y ALMACENAR ARRAY DE DATOS
        $datos = json_decode(file_get_contents('php://input'), true);
        // SEPARAR ARRAY DE DATOS EN VARIABLES INDIVIDUALES
        $tiempoDeMontaje = $datos['tiempoDeMontaje'] ?? NULL;
        $moduloDeMontaje = $datos['moduloDeMontaje'] ?? NULL;
        $horarioDeMontaje = $datos['horarioDeMontaje'] ?? NULL;
        $fechaDeMontaje = date('Y-m-d H:i:s');
        // VERIFICAR QUE TODOS LOS DATOS SEAN EXISTENTES
        if ($tiempoDeMontaje == NULL || $moduloDeMontaje == NULL || $horarioDeMontaje == NULL) {
            $respuesta = [
                'ok' => 'false',
                'respuesta' => 'SOLICITUD INVALIDA (CONERR3)'
            ];
            http_response_code(401);
            echo json_encode($respuesta);
            exit;
        }
        // PREPARAR CONSULTA
        $sql = "INSERT INTO tiempo_de_montaje (fecha, tiempo, modulo, horario) VALUES (?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("siii", $fechaDeMontaje, $tiempoDeMontaje, $moduloDeMontaje, $horarioDeMontaje);

        if($stmt->execute()) {
            $respuesta = [
                'ok' => 'true',
                'respuesta'=> 'El ingreso se ha realizado exitosamente'
            ];
            http_response_code(200);
            echo json_encode($respuesta);
        } else {
            $respuesta = [
                'ok' => false,
                'respuesta' => 'Ha ocurrido un error al indexar los datos'
            ];
            http_response_code(400);
            echo json_encode($respuesta);
        }
    } else {
        $respuesta = [
            'ok'=> false,
            'respuesta'=> 'METODO NO PERMITIDO',
        ];
        http_response_code(400);
        echo json_encode($respuesta);
    }

?>