<?php 

require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';
require_once '../config/horarios.php';
require_once '../func/obtenerMeta.php';

$minutesPerDay = getenv('MINUTES_PER_DAY') ?: 522;
$hoursPerDay = getenv('HOURS_PER_DAY') ?: 8.7;
$tiempoDeMontaje = NULL;
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
    $modulo = $postData['modulo'] ?? null;
    if ($adicionales == "" || $adicionales == null) {
        $adicionales = NULL;
    }

    if (empty($operador) || $unidadesProducidas === null) {
        http_response_code(401);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Formulario inválido (CONERR3)'
        ]);
        exit();
    }

    // OBTENER META POR EFICIENCIA
    $metaPorHora = obtenerMeta($mysqli, $operador, $referencia, $modulo, $fechaString, $minutesPerDay, $hoursPerDay);

    // Insertar en base de datos
    $stmt = $mysqli->prepare("INSERT INTO registro_produccion (fecha, op_id, ref_id, unidadesProducidas, MetaPorEficiencia, adicionales) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("siiiss", $fechaString, $operador, $referencia,  $unidadesProducidas, $metaPorHora, $adicionales); 

    if ($stmt->execute()) {
        $last_id = $mysqli->insert_id;
        http_response_code(200);
        echo json_encode([
            'ok' => true,
            'respuesta' => 'Solicitud exitosa',
            'id_del_recurso_creado' => $last_id
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