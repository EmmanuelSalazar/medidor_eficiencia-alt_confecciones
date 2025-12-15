<?php 

require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';

// Manejar solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(); // Termina la ejecución aquí
}

// Manejar solicitud POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos
    $referencia = $postData['codigoReferencia'] ?? null;
    $tiempoTarea = $postData['tiempoTarea'] ?? null;
    $cantidadPorModulo = $postData['cantidadPorModulo'] ?? null;


    if (empty($referencia) OR empty($tiempoTarea)) {
        http_response_code(401);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Referencia inválida (CONERR3)'
        ]);
        exit();
    }

    // Insertar en base de datos
    $stmt = $mysqli->prepare("INSERT INTO referencias (referencia, tiempoDeProduccion) VALUES (?, ?)");
    $stmt->bind_param("ss", $referencia, $tiempoTarea);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'ok' => true,
            'respuesta' => 'Solicitud exitosa',
            'referencia' => $referencia,
            'nome' => $tiempoTarea,
        ], true);
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
