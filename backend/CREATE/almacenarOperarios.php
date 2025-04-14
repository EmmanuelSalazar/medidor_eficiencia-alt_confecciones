<?php 

require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';


// Manejar solicitud POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);
    
    $nombreOperario = $postData['nombreOperario'] ?? null;
    $modulo = $postData['modulo'] ?? null;


    if (empty($nombreOperario)) {
        http_response_code(401);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Referencia inválida (CONERR3)'
        ]);
        exit();
    }

    // Insertar en base de datos
    $stmt = $mysqli->prepare("INSERT INTO operarios (nombre, modulo) VALUES (?, ?)");
    $stmt->bind_param("si", $nombreOperario, $modulo);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'ok' => true,
            'respuesta' => 'Solicitud exitosa',
            'Nombre del Operario' => $nombreOperario,
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