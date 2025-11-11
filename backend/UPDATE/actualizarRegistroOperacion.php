<?php 

require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';
require_once '../func/obtenerMeta.php';
$minutesPerDay = getenv('MINUTES_PER_DAY') ?: 522;
$hoursPerDay = getenv('HOURS_PER_DAY') ?: 8.7;
$tiempoDeMontaje = NULL;
    if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $datos = json_decode(file_get_contents('php://input'), true);
        $regProd_id = $datos['regProd_id'] ?? NULL;
        $ref_id = $datos['ref_id'] ?? NULL;
        $fechaString = (new DateTime())->format('Y-m-d H:i:s'); // Fecha y hora actual
        $unidadesProducidas = $datos['unidadesProducidas'] ?? NULL;
        $horario = $datos['horario'] ?? NULL;
        $modulo = $datos['modulo'] ?? NULL;
        $metaPorHora = $datos['meta'] ?? NULL;
        $recalcularMeta = $datos['recalcularMeta'] ?? false;
        $operario = $datos['op_id'] ?? NULL;
        if ($regProd_id === NULL || $ref_id === NULL || $unidadesProducidas === NULL || $horario === NULL || $modulo === NULL) { 
            echo json_encode([
                "ok" => false,
                "respuesta" => "SOLICITUD INVALIDA: ERR 402"
            ]);
            exit;
        }
        $mysqli->begin_transaction();

        if ($recalcularMeta) {
            $metaPorHora = obtenerMeta($mysqli, $operario, $ref_id, $modulo, $fechaString, $minutesPerDay, $hoursPerDay);
        }
        echo $metaPorHora;
        try {
            $sql = "UPDATE registro_produccion SET ref_id = ?, unidadesProducidas = ?, horario = ?, modulo = ?, MetaPorEficiencia = ? WHERE regProd_id = ?";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("iiisii", $ref_id, $unidadesProducidas, $horario, $modulo, $metaPorHora, $regProd_id);
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
