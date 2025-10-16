<?php 
    require_once '../config/baseDeDatos.php';
    require_once '../config/cors.php';
    $url = $_SERVER['REQUEST_URI'];
    $url = parse_url($url, PHP_URL_PATH);
    $url = explode('/', $url);
    $url = end($url);
    if($_SERVER['REQUEST_METHOD'] == 'GET'){
        $remision = $_GET['remision'] ?? null;
        if($url == 'detallarRemision') {
            $sql = 'SELECT
                b.orden_produccion,
                b.codigoBarras,
                b.client_id,
                r.referencia,
                b.detalle,
                b.talla,
                b.color,
                br.unidadesDespachadas,
                br.segundasDespachadas,
                br.bajas,
                (
                    unidadesDespachadas + segundasDespachadas
                ) AS TotalDespachado
            FROM
                bodega_remision br
            JOIN bodega b ON
                b.odp_id = br.odp_id
            JOIN referencias r ON
                r.ref_id = b.ref_id
            WHERE
                br.numeroDeRemision = ?
            GROUP BY
                br.rem_id;
            ';
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("i", $remision);
        } else {
            $sql = "SELECT
        br.numeroDeRemision,
        bc.nombre AS cliente,
        br.client_id,
        COUNT(*) AS OrdenesDespachadas,
        (
            SUM(br.unidadesDespachadas) + SUM(segundasDespachadas) + SUM(bajas)
        ) AS TotalUnidadesProducidas,
        COALESCE(br.observaciones, 'N/A') AS observaciones,
        br.fecha
    FROM
        `bodega_remision` br
    JOIN bodega_clientes bc ON
        bc.client_id = br.client_id
    JOIN bodega b ON
        b.odp_id = br.odp_id
    GROUP BY
        br.numeroDeRemision
    ORDER BY
        br.numeroDeRemision
    DESC 
    LIMIT 500
        ";
        $stmt = $mysqli->prepare($sql);
        }        
        if ($stmt->execute()) {
            $resultado = $stmt->get_result();
            $respuesta = [
                'ok' => true,
                'respuesta' => $resultado->fetch_all(MYSQLI_ASSOC)
            ];
            http_response_code(200);
            echo json_encode($respuesta);
        } else {
            $respuesta = [
                'ok' => false,
               'respuesta' => 'Error al ejecutar la consulta'
            ];
            http_response_code(500);
            echo json_encode($respuesta);
        }
    } else {
        $respuesta = [
            'ok' => false,
            'respuesta' => 'Método no permitido'
        ];
        http_response_code(405);
        echo json_encode($respuesta);
    }


?>