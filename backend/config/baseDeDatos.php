<?php 
    $host = getenv('DB_HOST') ?: 'localhost'; /* 151.106.97.51 */
    $user = getenv('DB_USER') ?: 'root'; /* u125170969_medidor */
    $password = getenv('DB_PASSWORD') ?: ''; /* 7OSOX$0V:v */
    $dbname = getenv('DB_NAME') ?: 'eficiencia_produccion'; /* u125170969_eficiencia */
date_default_timezone_set('America/Bogota');
$mysqli = new mysqli($host, $user, $password, $dbname);
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

?>