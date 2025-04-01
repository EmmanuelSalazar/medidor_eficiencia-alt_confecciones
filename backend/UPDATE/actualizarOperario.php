<?php
require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $id = intval($_GET['id']) ?? NULL;
    $nuevoOperarioContador = $_GET['operarioContador'] ?? false;

    if (!$id) {
        echo json_encode(['ok' => false, 'respuesta' => 'SOLICITUD INVALIDA: ERR400']);
        exit;
    }

    // Decodificar los datos enviados en el cuerpo de la solicitud
    $datos = json_decode(file_get_contents('php://input'), true);
    $nombre = $datos['nombreOperario'] ?? NULL;
    $modulo = $datos['modulo'] ?? NULL;
    $actividad = $datos['actividad'] ?? NULL;
    $revisor = $datos['revisor'] ?? NULL;
 echo $revisor;
    // Debugging: Imprimir los datos recibidos
    error_log("Datos recibidos: " . print_r($datos, true));

    // Iniciar transacción para asegurar consistencia
    $mysqli->begin_transaction();

    try {
        if ($nuevoOperarioContador == "true") {
            // Obtener el módulo del operario que se está actualizando
            $moduloQuery = "SELECT modulo FROM operarios WHERE op_id = ?";
            $stmt = $mysqli->prepare($moduloQuery);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $mysqli->error);
            }

            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $operario = $result->fetch_assoc();

            if (!$operario) {
                throw new Exception("El operario con ID $id no existe.");
            }

            $modulo_operario = $operario['modulo'];

            // Poner en 0 todos los demás operarios del mismo módulo
            $resetQuery = "UPDATE operarios SET calculadorFinal = 0 WHERE modulo = ? AND op_id <> ?";
            $stmt = $mysqli->prepare($resetQuery);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $mysqli->error);
            }

            $stmt->bind_param("ii", $modulo_operario, $id);
            $stmt->execute();

            // Actualizar el operario seleccionado a calculadorFinal = 1
            $updateQuery = "UPDATE operarios SET calculadorFinal = 1 WHERE op_id = ?";
            $stmt = $mysqli->prepare($updateQuery);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $mysqli->error);
            }

            $stmt->bind_param("i", $id);
            $stmt->execute();

            // Confirmar la transacción
            $mysqli->commit();

            echo json_encode(["ok" => true, "respuesta" => 'El Operario ha sido actualizado correctamente.']);

        } elseif ($nuevoOperarioContador == "false" || $nuevoOperarioContador == false) {
            if (!$nombre || !$modulo) {
                echo json_encode(['ok' => false, 'respuesta' => 'SOLICITUD INVALIDA: ERR 402']);
                exit;
            }

            // Obtener el módulo anterior del operario
            $moduloAnteriorQuery = "SELECT modulo FROM operarios WHERE op_id = ?";
            $stmt = $mysqli->prepare($moduloAnteriorQuery);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $mysqli->error);
            }

            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $operario = $result->fetch_assoc();

            if (!$operario) {
                throw new Exception("El operario con ID $id no existe.");
            }

            $modulo_anterior = $operario['modulo'];

            // Actualizar los datos generales del operario
            $sql = "UPDATE operarios SET nombre = ?, modulo = ?, activo = ?, revisador = ? WHERE op_id = ?";
            $stmt = $mysqli->prepare($sql);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $mysqli->error);
            }

            $stmt->bind_param("siiii", $nombre, $modulo, $actividad, $revisor, $id);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                // Recalcular metas para el módulo anterior y el nuevo módulo
                recalculaMetas($mysqli, $modulo_anterior);
                recalculaMetas($mysqli, $modulo);

                echo json_encode(["ok" => true, "respuesta" => 'El Operario ha sido actualizado correctamente.']);
            } else {
                throw new Exception("No se encontró ningún operario con ID $id para actualizar.");
            }
        } else {
            echo json_encode(['ok' => false, 'respuesta' => 'SOLICITUD INVALIDA: ERR 403']);
            exit;
        }
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $mysqli->rollback();
        echo json_encode(["ok" => false, "respuesta" => "Error: " . $e->getMessage()]);
    }
}

/**
 * Función para recalcular las metas de un módulo específico.
 *
 * @param mysqli $mysqli Conexión a la base de datos.
 * @param int $modulo Módulo para el cual se recalcularán las metas.
 */
function recalculaMetas($mysqli, $modulo) {
    try {
        // Contar cuántos operarios activos hay en el módulo
        $countQuery = "SELECT COUNT(*) AS cantidad_empleados_activos FROM operarios WHERE modulo = ? AND activo = 1";
        $stmt = $mysqli->prepare($countQuery);

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $mysqli->error);
        }

        $stmt->bind_param("i", $modulo);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $cantidad_empleados_activos = $row['cantidad_empleados_activos'];

        // Recalcular las metas para las referencias activas del módulo
        $updateQuery = "
            UPDATE metas
            JOIN referencias ON metas.ref_id = referencias.ref_id
            SET metas.meta = FLOOR((546 * ?) / referencias.tiempoDeProduccion)
            WHERE referencias.modulo = ? AND referencias.activo = 1
        ";
        $stmt = $mysqli->prepare($updateQuery);

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $mysqli->error);
        }

        $stmt->bind_param("ii", $cantidad_empleados_activos, $modulo);
        $stmt->execute();
    } catch (Exception $e) {
        error_log("Error al recalcular metas: " . $e->getMessage());
    }
}
?>