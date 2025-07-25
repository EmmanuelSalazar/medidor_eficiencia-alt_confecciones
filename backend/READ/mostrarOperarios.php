<?php 
require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';
if ($_SERVER['REQUEST_METHOD'] == 'GET') {  
    $redux = isset($_GET["redux"]) && $_GET["redux"] === "true"; // Verificar si redux es true            // Consulta especial cuando redux=true y no hay filtro de módulo

            $sql = "
                SELECT 
                    o.op_id,
                    o.nombre,
                    o.modulo,
                    o.activo,
                    o.posicion,
                    o.revisador,
                    CASE 
                        WHEN activo = 1 THEN 'Activo'
                        WHEN activo = 0 THEN 'Inactivo'
                        ELSE 'desconocido'
                    END AS estado,
                    CASE
                        WHEN revisador = 1 THEN 'Revisador/a'
                        WHEN revisador = 0 THEN 'Operario/a'
                        ELSE 'desconocido'
                    END AS revisor
                FROM 
                    operarios o ";
            if ($redux) {
                $sql .= "
                WHERE
                    o.activo = 1 AND
                    NOT EXISTS (
                        SELECT 1
                        FROM registro_produccion ro
                        WHERE ro.op_id = o.op_id
                          AND ro.fecha >= DATE_SUB(NOW(), INTERVAL 20 MINUTE)
                    )";
            }
            $sql.="ORDER BY 
                    o.posicion ASC;";
            $stmt = $mysqli->prepare($sql);
    // Ejecutar la consulta
    if (!$stmt) {
        http_response_code(400);
        $respuesta = [
            'ok' => false,
            'respuesta' => 'Error al preparar la consulta'
        ];
        header('Content-Type: application/json');
        echo json_encode($respuesta, true);
        exit;
    }

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