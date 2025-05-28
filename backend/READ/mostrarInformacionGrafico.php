<?php 

require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';

 if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $fecha = $_GET['fecha'] ?? null;
    $query = "SELECT
            o.nombre AS operario,
            ROUND(
                COALESCE(
                    SUM(unidadesProducidas) / SUM(MetaPorEficiencia),
                    0
                ) * 100,
                1
            ) AS EficienciaDelDia,
            SUM(unidadesProducidas) AS TotalProducido,
            ROUND(SUM(MetaPorEficiencia))AS TotalMeta,
            rp.modulo,
            o.posicion
        FROM
            `registro_produccion` rp
        JOIN operarios o ON
            o.op_id = rp.op_id
        WHERE
            DATE(fecha) = ";
    
    if ($fecha) {
        $query.= "'$fecha'";
    } else {
        $query.= "CURDATE()";
    }

    $query .= "GROUP BY
            rp.op_id
        ORDER BY
            o.posicion ASC
        LIMIT 100;";
    
    $stmt = $mysqli->prepare($query);
/*     $stmt->bind_param("i", var: $modulo);
 */    if ($stmt->execute()) {
        $respuesta['ok'] = true;
        $respuesta['respuesta'][0] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $query = "SELECT
                    COALESCE(ROUND(
                        SUM(CASE WHEN DATE(fecha) = CURDATE() THEN unidadesProducidas ELSE 0 END) / 
                        SUM(CASE WHEN DATE(fecha) = CURDATE() THEN MetaPorEficiencia ELSE 0 END) * 100,1), 0)
                    AS eficienciaDiaria,
                    COALESCE(ROUND(
                        SUM(unidadesProducidas) / SUM(MetaPorEficiencia) * 100, 1), 0)
                    AS eficienciaQuincenal,
                    modulo
                FROM
                    registro_produccion
                WHERE
                    rol = 1 AND DATE(fecha) BETWEEN '2025-05-16' AND '2025-05-31'
                GROUP BY
                    modulo;";

        $stmt = $mysqli->prepare($query);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $eficienciaQuincenal = $resultado->fetch_all(MYSQLI_ASSOC);
        $respuesta['respuesta'][1] = $eficienciaQuincenal;
        echo json_encode($respuesta, true);
    }

    

 }

?>