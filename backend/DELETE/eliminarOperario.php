<?php 
    require_once '../config/cors.php';
    require_once '../baseDeDatos.php';
    if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        $id = $_GET['id'] ?? NULL;

        $sql = 'DELETE FROM operarios WHERE op_id = ?';
        $sql = $mysqli->prepare($sql);
        $sql->bind_param('i', $id);
        if($sql->execute()) {
            $respuesta = array('ok' => 'true', 'respuesta' => 'El operario ha sido eliminado');
            echo json_encode($respuesta, true);
        } else {
            $respuesta = array('ok' => 'false', 'respuesta' => 'El operario no ha sido eliminado');
            echo json_encode($respuesta, true);
        }
    }



?>