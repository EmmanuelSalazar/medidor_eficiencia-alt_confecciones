<?php 
require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $id = $_GET['id'] ?? null;

    // Validación del ID
    if (!$id || !is_numeric($id)) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'ID de usuario inválido o no proporcionado'
        ]);
        exit;
    }

    // Preparar consulta
    if (!$stmt = $mysqli->prepare('DELETE FROM usuarios WHERE user_id = ?')) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Error al preparar consulta: ' . $mysqli->error
        ]);
        exit;
    }

    $stmt->bind_param('i', $id);
    
    // Ejecutar y verificar
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Error al eliminar: ' . $stmt->error
        ]);
        exit;
    }

    // Verificar eliminación real
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode([
            'ok' => true,
            'respuesta' => 'Usuario eliminado exitosamente'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'No se encontró el operario con ese ID'
        ]);
    }

    $stmt->close();
    $mysqli->close();
} else {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'respuesta' => 'Método no permitido'
    ]);
}
?>