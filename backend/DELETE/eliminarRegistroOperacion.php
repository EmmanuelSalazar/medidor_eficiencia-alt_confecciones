<?php 
    require_once '../config/cors.php';
    require_once '../baseDeDatos.php';
    if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        $id = $_GET['id'] ?? NULL;

        $sql = 'DELETE FROM registro_produccion WHERE regProd_id = ?';
        $sql = $mysqli->prepare($sql);
        $sql->bind_param('i', $id);
        if($sql->execute()) {
            $respuesta = array('ok' => 'true', 'respuesta' => 'El registro ha sido eliminado con exito');
            echo json_encode($respuesta, true);
        } else {
            $respuesta = array('ok' => 'false', 'respuesta' => 'El registro no ha sido eliminado');
            echo json_encode($respuesta, true);
        }
    }



?>