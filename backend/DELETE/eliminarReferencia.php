<?php 
    require_once '../config/cors.php';
    require_once '../baseDeDatos.php';
    if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        $id = $_GET['id'] ?? NULL;

        $sql = 'DELETE FROM referencias WHERE ref_id = ?';
        $sql = $mysqli->prepare($sql);
        $sql->bind_param('i', $id);
        if($sql->execute()) {
            $respuesta = array('ok' => 'true', 'respuesta' => 'La referencia ha sido eliminada');
            echo json_encode($respuesta, true);
        } else {
            $respuesta = array('ok' => 'false', 'respuesta' => 'La referencia no ha sido eliminada');
            echo json_encode($respuesta, true);
        }
    }



?>