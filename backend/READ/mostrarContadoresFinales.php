<?php 
require_once '../config/cors.php';
require_once '../baseDeDatos.php';
$datos = [];

$query = 'SELECT * FROM operarios WHERE calculadorFinal = 1';
if($query = mysqli_query($mysqli, $query)) {
    while($fila = mysqli_fetch_array($query)) {
        $datos[] = $fila;
    }
    $respuesta = [
        "ok" => true,
        "respuesta" => $datos
    ];
    echo json_encode($respuesta, JSON_PRETTY_PRINT);
}


?>