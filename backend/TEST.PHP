<?php 
/* require_once './config/baseDeDatos.php';
 $sql = "SELECT 
 DATE(fecha) AS Fecha,
 SUM(unidadesProducidas) AS TotalProducidas,
 SUM(MetaPorEficiencia) AS TotalParaProducir
FROM 
 registro_produccion
WHERE 
 op_id = 68 AND DATE(fecha) BETWEEN '2025-04-16' AND '2025-04-30'
GROUP BY 
 DATE(fecha)
ORDER BY
 DATE(fecha)";

 $stmt = $mysqli->prepare($sql);
 $stmt->execute();
 $resultado = $stmt->get_result();
 $registros = $resultado->fetch_all(MYSQLI_ASSOC);
$respuesta = [
    'ok' => true,
    'registros' => $registros

    ];
 echo json_encode($respuesta, true); */

 $var = 1;
 $foo = "12";

 echo $var + $foo;

?>