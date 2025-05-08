<?php 
    include_once '../config/baseDeDatos.php';
    include_once '../config/cors.php';

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $query = "SELECT * FROM bodega_clientes";
        $stmt = $mysqli->prepare($query);

        if ($stmt->execute()) {
            $resultado = $stmt->get_result();
            $resultado = $resultado->fetch_all(MYSQLI_ASSOC);
            $respuesta = [
                'ok' => true,
                'respuesta' => $resultado
            ];
            http_response_code(200); // OK
            echo json_encode($respuesta, true);
        } else {
            $respuesta = [
                'ok' => false,
               'respuesta' => 'No hay clientes registrados'
            ];
        }
    } else {
        $respuesta = [
            'ok' => false,
            'respuesta' => 'Método no permitido'
        ];
        http_response_code(405); // Method Not Allowed
        echo json_encode($respuesta);
    }

?>