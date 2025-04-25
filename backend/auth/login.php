<?php
    require_once '../config/cors.php';
    require_once '../vendor/autoload.php';
    require_once '../config/baseDeDatos.php';
    use Firebase\JWT\JWT;
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    $secretKey = $_ENV['SECRET_KEY'];

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $datos = json_decode(file_get_contents('php://input'), true);

        $usuario = mysqli_real_escape_string($mysqli, $datos['usuario']) ?? NULL;
        $contrasena = mysqli_real_escape_string($mysqli,$datos['contrasena']) ?? NULL;
        if ($contrasena === NULL || $usuario === NULL) {
            $respuesta = [
                'ok'=> false,
                'respuesta'=> "PETICION INVALIDA",
            ];
            http_response_code(401);
            echo json_encode($respuesta);
            exit();
        }
        // VERIFICAR CONTRASEÑA
        $stms = $mysqli->prepare("SELECT contrasena FROM usuarios WHERE nombre = ?");
        $stms->bind_param("s", $usuario);
        if($stms->execute()) {
            $resultado = $stms->get_result();
            if ($resultado->num_rows > 0) {
                if (password_verify($contrasena, $resultado->fetch_assoc()['contrasena'])) {
                    $sql = "SELECT user_id,nombre,rol FROM usuarios WHERE nombre = ?";
                    $sql = $mysqli->prepare($sql);
                    $sql->bind_param("s", $usuario);
                    if($sql->execute()) {
                        $sql = $sql->get_result();
                        $sql = $sql->fetch_all(MYSQLI_ASSOC);
                        $payload = [
                            "user_id" => $sql[0]['user_id'],
                            "nombre" => $sql[0]["nombre"],
                            "rol" => $sql[0]["rol"],
                            "exp" => time() + 432000,
                            "iat" => time()
                        ];
                        $jwt = JWT::encode($payload, $secretKey, 'HS256');
                        $respuesta = [
                            'ok'=> true,
                            'respuesta'=> $jwt
                        ];
                        http_response_code(200);
                        echo json_encode($respuesta, true);
                    } else {
                        $respuesta = [
                            'ok'=> false,
                           'respuesta'=> "Ha ocurrido un error al realizar la consulta",
                        ];
                        http_response_code(500);
                        echo json_encode($respuesta, true);
                    }
                } else {
                    $respuesta = [
                        'ok'=> false,
                       'respuesta'=> "Usuario o contraseña incorrectos",
                    ];
                    http_response_code(401);
                    echo json_encode($respuesta);
                    exit();
                }
            }
        }
    } else {
        $respuesta = [
            "ok"=> false,
            "respuesta"=> "METODO NO PERMITIDO",
        ];
        http_response_code(401);
        echo json_encode($respuesta, true);
    }
?>