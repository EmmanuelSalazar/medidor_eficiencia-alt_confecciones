<?php 
    require_once './../config/baseDeDatos.php';
    require_once './../config/cors.php';
    if($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $datos = json_decode(file_get_contents('php://input'), true);
        $tipo = $datos['tipo']?? NULL;
        $id = $datos['id']?? NULL;
        $fecha = date('Y-m-d H:i:s');
        if (empty($tipo)) {
            $response =[
                'ok' => 'false',
                'respuesta' => 'Faltan datos'
            ];
            echo json_encode($response);
            exit();
        }
        if($tipo === 1) {
            $sql = 'UPDATE bodega SET fecha_ingresoPlanta = ? WHERE odp_id = ?';
        } elseif($tipo === 2) {
            $sql = 'UPDATE bodega SET fecha_salidaPlanta = ? WHERE odp_id = ?';
        }
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("si", $fecha, $id);
        if($stmt->execute()){
            $response =[
                'ok' => 'true',
                'respuesta' => 'Datos actualizados'
            ];
            echo json_encode($response);
            exit();
        }
       

    }

?>