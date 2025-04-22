<?php 

 require_once '../config/baseDeDatos.php';
 require_once '../config/cors.php';
    
    if($_SERVER['REQUEST_METHOD'] == 'GET') {
        $sql = "SELECT
                user_id,
                nombre,
                CASE 
                    WHEN rol = 1 THEN 'Tablero'
                    WHEN rol = 2 THEN 'Supervisor/a'
                    WHEN rol >= 3 THEN 'Administrador/a'  
                    ELSE 'ROL DESCONOCIDO' 
                    END AS rol    
            FROM `usuarios` ORDER BY user_id DESC;";
       
            if($resultado = mysqli_query($mysqli, $sql)) {
                $usuarios = mysqli_fetch_all($resultado, MYSQLI_ASSOC);
                if ($usuarios) {
                    $respuesta = [
                        'ok' => true,
                        'respuesta' => $usuarios
                    ];
                    echo json_encode($respuesta, flags: true);
                    http_response_code(200);
                } else {
                    $respuesta = [
                        'ok' => false,
                        'respuesta' => "No se encontraron usuarios."
                    ];
                    echo json_encode($respuesta, flags: true);
                    http_response_code(404);
                }   
            } else {
                $respuesta = [
                    'ok' => false,
                    'respuesta' => "Ha ocurrido un error al realizar la consulta."
                ];
                http_response_code(500);
                echo json_encode($respuesta, flags: true);
            }
    } else {
        $respuesta = [
            'ok' => false,
            'respuesta' => "Método no permitido."
        ];
        echo json_encode($respuesta, flags: true);
        http_response_code(405);
    }

?>