<?php 
require __DIR__ . '/rutas.php';
require  __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(ROOT_PATH);
$dotenv->load();
    $host = $_ENV['DB_HOST'] ?: /* 'srv449.hstgr.io' */ 'srv449.hstgr.io';
    $user = $_ENV['DB_USER'] ?: /* 'u125170969_medidor' */ 'u125170969_medidor';
    $password = $_ENV['DB_PASSWORD'] ?: /* '7OSOX$0V:v' */ 'gstf>tM6I8!';
    $dbname = $_ENV['DB_NAME'] ?: /* 'u125170969_eficiencia' */ 'u125170969_eficiencia';
date_default_timezone_set('America/Bogota');
$mysqli = new mysqli($host, $user, $password, $dbname);
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
$mysqli->set_charset("utf8mb4");
?>