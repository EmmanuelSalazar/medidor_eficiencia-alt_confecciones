<?php
require_once '../config/cors.php';
require_once '../baseDeDatos.php';

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    // Decodificar los datos enviados en el cuerpo de la solicitud
    $datos = json_decode(file_get_contents('php://input'), true);

    // Extraer los datos del cuerpo JSON
    $referencia = $datos['referencia'] ?? NULL;
    $tiempoDeProduccion = $datos['tiempoDeProduccion'] ?? NULL;
    $modulo = $datos['modulo'] ?? NULL;
    $activo = $datos['estado'] ?? NULL; // Cambio: Usar "activo" en lugar de "estado"

    // Validar que los datos necesarios estén presentes
    if (!$referencia || !$tiempoDeProduccion || !$modulo || $activo === NULL) {
        echo json_encode(['ok' => false, 'respuesta' => 'SOLICITUD INVALIDA: ERR 402']);
        exit;
    }

    // Iniciar transacción para asegurar consistencia
    $mysqli->begin_transaction();

    try {
        // Actualizar la referencia seleccionada
        $sql = "UPDATE referencias SET tiempoDeProduccion = ?, modulo = ?, activo = ? WHERE referencia = ?";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("siis", $tiempoDeProduccion, $modulo, $activo, $referencia); // Usamos "iiis" porque `tiempoDeProduccion`, `modulo` y `activo` son enteros, y `referencia` es una cadena

        if (!$stmt->execute()) {
            throw new Exception("Error al actualizar la referencia.");
        }

        // Confirmar la transacción
        $mysqli->commit();

        echo json_encode(["ok" => true, "respuesta" => 'La referencia ha sido actualizada correctamente.']);
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $mysqli->rollback();
        echo json_encode(["ok" => false, "respuesta" => "Error: " . $e->getMessage()]);
    }
}
?>