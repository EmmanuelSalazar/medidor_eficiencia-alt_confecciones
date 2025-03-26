<?php
require_once 'config/cors.php';
require_once 'baseDeDatos.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Obtener el parámetro "modulo" del query string
    $modulo = $_GET['modulo'] ?? null;
    $todos = boolval($_GET['redux']);
    // Construir la consulta base
    $sql = "
        SELECT 
            ref_id,
            referencia,
            modulo,
            tiempoDeProduccion,
            CASE 
                WHEN activo = 1 THEN 'Activo'
                WHEN activo = 0 THEN 'Inactivo'
                ELSE 'Desconocido' -- Manejar valores inesperados
            END AS estado
        FROM referencias
    ";


    // Agregar filtro por módulo si se proporciona
    if ($modulo !== null && is_numeric($modulo)) {
        $sql .= "WHERE modulo = ? ";
    }

    if ($todos) {
        $sql .= "AND activo = 1";       
    }

    // Ordenar los resultados
    $sql .= " ORDER BY ref_id DESC";

    // Preparar la consulta
    $stmt = $mysqli->prepare($sql);
    if (!$stmt) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Error al preparar la consulta: ' . $mysqli->error
        ], JSON_PRETTY_PRINT);
        exit;
    }

    // Vincular parámetros si se proporciona un módulo
    if ($modulo !== null && is_numeric($modulo)) {
        $stmt->bind_param("i", $modulo);
    }

    // Ejecutar la consulta
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $query = $resultado->fetch_all(MYSQLI_ASSOC);
        $respuesta = [
            'ok' => true,
            'respuesta' => $query
        ];
    } else {
        $respuesta = [
            'ok' => false,
            'respuesta' => 'No se encontraron resultados'
        ];
    }

    // Devolver la respuesta
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($respuesta, JSON_PRETTY_PRINT);

    // Cerrar la conexión
    $stmt->close();
    $mysqli->close();
} else {
    http_response_code(400);
    echo json_encode(['ok' => false, 'respuesta' => 'Método no permitido'], JSON_PRETTY_PRINT);
}
?>