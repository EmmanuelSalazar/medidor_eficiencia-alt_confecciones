<?php 

    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $datos = json_decode(file_get_contents("php://input"), true);
        $modulo = (int)mysqli_real_escape_string($mysqli, $datos['modulo']) ?? null;
        $odp = mysqli_real_escape_string($mysqli, $datos['odp']) ?? null;
        $detalle = (string)mysqli_real_escape_string($mysqli, string: $datos['detalle']) ?? null;
        $talla = (string)mysqli_real_escape_string($mysqli, string: $datos['talla']) ?? null;
        $color = mysqli_real_escape_string($mysqli, $datos['color']) ?? null;
        $cantidad = (int)mysqli_real_escape_string($mysqli, $datos['cantidad']) ?? null;
        $referencia = mysqli_real_escape_string($mysqli, $datos['referencia'])?? null;
        $codBarras = (int)mysqli_real_escape_string($mysqli, $datos['codBarras'])?? null;
        $clientID = (int)mysqli_real_escape_string($mysqli, $datos['cliente'])?? null;
        $comentario = (string)mysqli_real_escape_string($mysqli, string: $datos['comentario'])?? null;
        if (empty ($odp) || empty($talla) || empty($color) || empty($cantidad) || empty($referencia) || empty($codBarras) || empty($clientID)) {
            $respuesta = [
                'ok' => false,
                'respuesta' => 'Formulario incompleto'
            ];
            http_response_code(406);
            echo json_encode($respuesta);
            exit();
        }
        $sql = "INSERT INTO bodega (orden_produccion, ref_id, client_id, codigoBarras, detalle, talla, color, cantidad, cantidad_producida, modulo, comentarios) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param('siiisssiiis', $odp, $referencia, $clientID, $codBarras, $detalle, $talla, $color, $cantidad, $cantidad, $modulo, $comentario);
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