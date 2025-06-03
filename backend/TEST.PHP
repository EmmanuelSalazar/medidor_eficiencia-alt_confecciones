<?php 
require_once './config/baseDeDatos.php';
require_once './config/cortes.php';
require_once './config/cors.php';
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

 /* $var = 1;
 $foo = "12";

 echo $var + $foo; */
 $fecha = $_GET['fecha'] ?? null;
 if($fecha) {
     $cortes = obtenerCorte($fecha);
 } else {
     $fecha = date('Y-m-d');
     $cortes = obtenerCorte($fecha);
 }
 $query = "SELECT
 COALESCE(ROUND(
     SUM(CASE WHEN DATE(fecha) = ? THEN unidadesProducidas ELSE 0 END) / 
     SUM(CASE WHEN DATE(fecha) = ? THEN MetaPorEficiencia ELSE 0 END) * 100,1), 0)
 AS eficienciaDiaria,
 COALESCE(ROUND(
     SUM(unidadesProducidas) / SUM(MetaPorEficiencia) * 100, 1), 0)
 AS eficienciaQuincenal,
 modulo
FROM
 registro_produccion
WHERE
 rol = 1 AND DATE(fecha) BETWEEN ? AND ?
GROUP BY
 modulo;";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("ssss", $fecha, $fecha, $cortes[0], $cortes[1]);
$stmt->execute();
$resultado = $stmt->get_result();
$eficienciaQuincenal = $resultado->fetch_all(MYSQLI_ASSOC);
print_r($eficienciaQuincenal);

?>