<?php 

    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $datos = json_decode(file_get_contents("php://input"), true);
        $odp = mysqli_real_escape_string($mysqli, $datos['odp']) ?? null;
        $talla = (int)mysqli_real_escape_string($mysqli, string: $datos['talla']) ?? null;
        $color = mysqli_real_escape_string($mysqli, $datos['color']) ?? null;
        $cantidad = (int)mysqli_real_escape_string($mysqli, $datos['cantidad']) ?? null;
        $referencia = mysqli_real_escape_string($mysqli, $datos['referencia'])?? null;
        if (empty ($odp) || empty($talla) || empty($color) || empty($cantidad) || empty($referencia)) {
            $respuesta = [
                'ok' => false,
                'respuesta' => 'Formulario incompleto'
            ];
            http_response_code(406);
            echo json_encode($respuesta);
            exit();
        }
        $sql = "INSERT INTO bodega (orden_produccion, ref_id, talla, color, cantidad, cantidad_producida) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param('ssisii', $odp, $referencia, $talla, $color, $cantidad, $cantidad);
        if($stmt->execute()) {
            $respuesta = [
                'ok' => true,
                'respuesta' => 'Produccion almacenada'
            ];
            http_response_code(200);
            echo json_encode($respuesta);
            exit();
        }
    }

?>