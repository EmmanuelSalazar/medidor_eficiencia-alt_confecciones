<?php 

require_once '../config/cors.php';
require_once '../baseDeDatos.php';

 if ($_SERVER['REQUEST_METHOD'] === 'GET') { 
    $modulo = (int)$_GET['modulo'] ?? null;

    if ($modulo == null || !is_numeric($modulo)) {
        $respuesta = [
            'ok' => false,
            'respuesta' => 'SOLICITUD INVALIDA: ERR402'
        ];
        echo json_encode($respuesta, true);
        exit;
    }
    #$query = " SELECT COUNT(*) AS eficiencia FROM registro_produccion WHERE modulo = ? AND fecha BETWEEN CURDATE() - INTERVAL 15 DAY AND CURDATE() AND op_id = 44";
    $query = "SELECT 
                o.op_id,
                o.nombre AS Operario,
                ROUND((SUM(rp.unidadesProducidas) / SUM(rp.MetaPorEficiencia)) * 100, 2) AS eficiencia
            FROM 
                operarios o
            LEFT JOIN 
                registro_produccion rp ON o.op_id = rp.op_id AND rp.modulo = ?
            WHERE 
                rp.fecha BETWEEN CURDATE() - INTERVAL 15 DAY AND CURDATE()
            GROUP BY 
                o.op_id, o.nombre
            ORDER BY 
                o.nombre";
    
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("i", $modulo);
    if ($stmt->execute()) {
        $respuesta = [
            'ok' => true,
            'respuesta' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)
        ];
        echo json_encode($respuesta, true);
    }

    

 }

?>