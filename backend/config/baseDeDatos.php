<?php 
require 'rutas.php';
require '../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(ROOT_PATH);
$dotenv->load();
    $host = $_ENV['DB_HOST'] ?: /* 'srv449.hstgr.io' */ 'localhost';
    $user = $_ENV['DB_USER'] ?: /* 'u125170969_medidor' */ 'root';
    $password = $_ENV['DB_PASSWORD'] ?: /* '7OSOX$0V:v' */ '';
    $dbname = $_ENV['DB_NAME'] ?: /* 'u125170969_eficiencia' */ 'eficiencia_desarrollo';
date_default_timezone_set('America/Bogota');
$mysqli = new mysqli($host, $user, $password, $dbname);
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
$mysqli->set_charset("utf8mb4");
?>