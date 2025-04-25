<?php 

    require_once '../config/cors.php';
    require_once '../config/baseDeDatos.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // RECIBIR Y ALMACENAR ARRAY DE DATOS
        $datos = json_decode(file_get_contents('php://input'), true);
        // DIVIDIR INFORMACIÓN
        $nombreUsuario = mysqli_escape_string($mysqli, $datos['nombreUsuario']) ?? NULL;
        $contrasenaUsuario = mysqli_escape_string($mysqli,$datos['contrasenaUsuario']) ?? NULL;
        $rolUsuario = mysqli_escape_string($mysqli,$datos['rolUsuario']) ?? NULL;

        // VERIFICAR DATOS

        if ($nombreUsuario == NULL || $contrasenaUsuario == NULL || $rolUsuario == NULL) {
            http_response_code(401);
            echo json_encode([
                'ok' => false,
                'respuesta' => 'Operacion inválida (CONERR3)'
            ]);
            exit();
        }

        // CIFRAR CONTRASEÑA

        $contrasenaUsuario = password_hash($contrasenaUsuario, PASSWORD_BCRYPT);

        $sql = "INSERT INTO usuarios (nombre, contrasena, rol) VALUES (?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("ssi", $nombreUsuario, $contrasenaUsuario, $rolUsuario);
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                'ok' => true,
                'respuesta' => 'El ingreso se ha realizado exitosamente',
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
            'respuesta' => 'Método no permitido (CONERR5)'
        ]);
    }

?>