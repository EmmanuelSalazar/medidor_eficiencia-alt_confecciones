<?php 

require_once '../config/cors.php';
require_once '../baseDeDatos.php';

    if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $datos = json_decode(file_get_contents('php://input'), true);
        $regProd_id = $datos['regProd_id'] ?? NULL;
        $ref_id = $datos['ref_id'] ?? NULL;
        $unidadesProducidas = $datos['unidadesProducidas'] ?? NULL;
        $horario = $datos['horario'] ?? NULL;

        if ($regProd_id === NULL || $ref_id === NULL || $unidadesProducidas === NULL || $horario === NULL) { 
            echo json_encode([
                "ok" => false,
                "respuesta" => "SOLICITUD INVALIDA: ERR 402"
            ]);
            exit;
        }
        $mysqli->begin_transaction();

        try {
            $sql = "UPDATE registro_produccion SET ref_id = ?, unidadesProducidas = ?, horario = ? WHERE regProd_id = ?";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("iiii", $ref_id, $unidadesProducidas, $horario, $regProd_id);
            if ($stmt->execute()) {
                $mysqli->commit();
                echo json_encode(["ok" => true, "respuesta" => 'El registro ha sido actualizado con exito.']);
            } else {
                throw new Exception("Error al actualizar el registro.");
            }
        } catch (mysqli_sql_exception $e) {
            $mysqli->rollback();
            echo json_encode(["ok" => false, "respuesta" => "Error: " . $e->getMessage()]);
    }
}


?>
