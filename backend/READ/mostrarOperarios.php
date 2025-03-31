<?php 
require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {  
    $modulo = $_GET["modulo"] ?? NULL;
    $redux = isset($_GET["redux"]) && $_GET["redux"] === "true"; // Verificar si redux es true

    if ($modulo != 'null') {
        if ($redux) {
            // Consulta especial cuando redux=true
            $sql = "
                SELECT 
                    o.op_id,
                    o.nombre,
                    o.modulo,
                    O.activo,
                    CASE 
                        WHEN o.activo = 1 THEN 'Activo'
                        WHEN o.activo = 0 THEN 'Inactivo'
                        ELSE 'desconocido'
                    END AS estado
                FROM 
                    operarios o
                WHERE 
                    o.modulo = ? AND o.activo = 1
                    AND NOT EXISTS (
                        SELECT 1
                        FROM registro_produccion ro
                        WHERE ro.op_id = o.op_id
                          AND ro.fecha >= DATE_SUB(NOW(), INTERVAL 20 MINUTE)
                    )
                ORDER BY 
                    o.op_id ASC;
            ";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("i", $modulo);
        } else {
            $sql = "
                SELECT 
                    op_id,
                    nombre,
                    modulo,
                    revisador,
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
                    operarios
                WHERE 
                    modulo = ?
                ORDER BY 
                    op_id DESC;
            ";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("i", $modulo); 
        }
    } else {
        if ($redux) {
            // Consulta especial cuando redux=true y no hay filtro de módulo
            $sql = "
                SELECT 
                    o.op_id,
                    o.nombre,
                    o.modulo,
                    o.activo,
                    CASE 
                        WHEN o.activo = 1 THEN 'Activo'
                        WHEN o.activo = 0 THEN 'Inactivo'
                        ELSE 'desconocido'
                    END AS estado
                FROM 
                    operarios o
                WHERE 
                    o.activo = 1 AND
                    NOT EXISTS (
                        SELECT 1
                        FROM registro_produccion ro
                        WHERE ro.op_id = o.op_id
                          AND ro.fecha >= DATE_SUB(NOW(), INTERVAL 20 MINUTE)
                    )
                ORDER BY 
                    o.op_id ASC;
            ";
            $stmt = $mysqli->prepare($sql);
        } else {
            $sql = "
                SELECT 
                    op_id,
                    nombre,
                    modulo,
                    revisador,
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
                    operarios
                ORDER BY 
                    op_id DESC;
            ";
            $stmt = $mysqli->prepare($sql);
        }
    }

    // Ejecutar la consulta
    if (!$stmt) {
        http_response_code(400);
        $respuesta = [
            'ok' => false,
            'respuesta' => 'Error al preparar la consulta'
        ];
        header('Content-Type: application/json');
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
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