<?php 
    include_once '../config/baseDeDatos.php';
    include_once '../config/cors.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $datos = json_decode(file_get_contents('php://input'), true);
        $nombreCliente = $datos['nombre'];
        $dirCliente = $datos['direccion'];
        $telCliente = $datos['telefono'];
        $ciudadCliente = $datos['ciudad'];
        $nitCliente = $datos['nit'];
        
        if (empty($nombreCliente) || empty($dirCliente) || empty($telCliente) || empty($ciudadCliente) || empty($nitCliente)) {
            http_response_code(401);
            echo json_encode([
                'ok' => false,
                'respuesta' => 'Consulta inválida (CONERR3)'
            ]);
        }

        $sql = "INSERT INTO bodega_clientes (nombre, direccion, telefono, ciudad, nit) VALUES (?, ?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("sssss", $nombreCliente, $dirCliente, $telCliente, $ciudadCliente, $nitCliente);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                'ok' => true,
               'respuesta' => 'El cliente se ha almacenado correctamente'
            ], true);
        } else {
            http_response_code(500);
            echo json_encode([
                'ok' => false,
               'respuesta' => 'Error en la base de datos (CONERR1)'
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Método no permitido'
        ]);
    }

?>