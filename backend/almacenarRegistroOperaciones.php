<?php 

require_once 'config/cors.php';
require_once 'baseDeDatos.php';
require 'config/horarios.php';

// Manejar solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(); // Termina la ejecución aquí
}

// Manejar solicitud POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    // Validar datos
    $fechaString = (new DateTime())->format('Y-m-d H:i:s'); // Fecha y hora actual
    $operador = $postData['operario'] ?? null;
    $unidadesProducidas = $postData['unidadesProducidas'] ?? null;
    $referencia = $postData['referencia'] ?? null;
    $adicionales = $postData['adicionales'] ?? null;

    if ($adicionales == "" || $adicionales == null) {
        $adicionales = NULL;
    }

    if (empty($operador) || empty($unidadesProducidas)) {
        http_response_code(401);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Formulario inválido (CONERR3)'
        ]);
        exit();
    }

    // Calcular la hora límite (1 hora antes de la fecha actual)
/*     $horaLimite = (new DateTime())->modify('-1 hour')->format('Y-m-d H:i:s');
 */
    // Verificar si ya existe un registro para el mismo op_id en la última hora
    /* $stmtVerificacion = $mysqli->prepare("SELECT COUNT(*) AS count FROM registro_produccion WHERE op_id = ? AND fecha >= ?");
    $stmtVerificacion->bind_param("is", $operador, $horaLimite);
    $stmtVerificacion->execute();
    $result = $stmtVerificacion->get_result();
    $row = $result->fetch_assoc(); */

    /* if ($row['count'] > 0) { */
        // Ya existe un registro para este operario en la última hora
       /*  http_response_code(response_code: 400);
        $respuesta = [
            'ok' => false,
            'respuesta' => 'Ya existe un registro para este operario en la última hora (CONERR6)'
        ];
        echo json_encode($respuesta, true);
        $stmtVerificacion->close();
        exit();
    } */

    // Insertar en base de datos
    $stmt = $mysqli->prepare("INSERT INTO registro_produccion (fecha, op_id, ref_id, unidadesProducidas, adicionales) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("siiis", $fechaString, $operador, $referencia,  $unidadesProducidas, $adicionales);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'ok' => true,
            'respuesta' => 'Solicitud exitosa',
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Error en la base de datos (CONERR1)'
        ]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'respuesta' => 'Método no permitido (CONERR5)'
    ]);
}
?>