<?php 
    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';
    
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $pagina = (int)$_GET['pagina'];
        $limite = 100;
        $activos = (bool)$_GET['activos'] ?? 0;
        $offset = ($pagina - 1) * $limite;
        $sql = 'SELECT
                b.odp_id,
                b.orden_produccion,
                b.client_id,
                bc.nombre AS cliente,
                b.ref_id,
                b.talla,
                COALESCE(b.detalle, "N/A") AS detalle,
                b.codigoBarras,
                b.color,
                b.cantidad,
                b.estado,
                b.fecha_inicio,
                b.fecha_final,
                b.cantidad_producida,
                COALESCE(b.comentarios, "N/A") AS comentarios,
                b.temporal,
                b.fecha_ingresoPlanta,
                b.fecha_salidaPlanta,
                r.referencia,
                r.modulo,
                ROUND(
                    b.cantidad_producida / m.meta,
                    1
                ) AS DiasDeTrabajo
            FROM
                bodega b
            JOIN referencias r ON
                b.ref_id = r.ref_id
            JOIN metas m ON
                b.ref_id = m.ref_id
            JOIN bodega_clientes bc ON
                bc.client_id = b.client_id
             ';
            $sql .= $activos ? 'WHERE b.estado <> 2 ' : '';
            $sql .= ' ORDER BY
                b.odp_id
                DESC
                LIMIT ?
                OFFSET ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ii", $limite, $offset);
    if($stmt->execute()) {
            $resultado = $stmt->get_result();
            $bodega = $resultado->fetch_all(MYSQLI_ASSOC);
            $sql = 'SELECT COUNT(*) AS total FROM bodega';
            $stmt = $mysqli->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $total = $resultado->fetch_assoc()['total'];
            $respuesta = [
                'ok' => true,
                'respuesta' => [
                    'total' => $total,
                    'datos' => $bodega
                ]
            ];
            http_response_code(200);
            echo json_encode($respuesta, true);
        } else {
            $respuesta = [
                'ok' => false,
               'respuesta' => 'Error al obtener datos'
            ];
/*             http_response_code(500);
 */            echo json_encode($respuesta, true);
        }
        
    } else {
        $respuesta = [
            'ok' => false,
          'respuesta' => 'Método no permitido'
        ];
        http_response_code(405);
        echo json_encode($respuesta, true);
    }
?>