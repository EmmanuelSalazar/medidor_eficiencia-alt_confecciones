<?php

require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';

// Validar formato de fecha
$fechaFiltro = $_GET['fecha'] ?? date('Y-m-d');
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaFiltro)) {
    $fechaFiltro = date('Y-m-d');
}

// Consultar horarios únicos
$horasQuery = "SELECT DISTINCT rp.horario
               FROM registro_produccion rp
               INNER JOIN operarios o ON rp.op_id = o.op_id
               WHERE DATE(rp.fecha) = '$fechaFiltro'
               ORDER BY rp.horario ASC";

$horasResult = $mysqli->query($horasQuery);
if (!$horasResult) {
    die(json_encode([
        "ok" => false,
        "error" => "Error en consulta de horarios: " . $mysqli->error
    ]));
}

$horarios = [];
while ($row = $horasResult->fetch_assoc()) {
    $horarios[] = $row['horario'];
}

// Construir columnas dinámicas SOLO si hay horarios
$columnasSQL = "";
if (!empty($horarios)) {
    $columnas = [];
    foreach ($horarios as $horario) {
        $columnas[] = "SUM(CASE WHEN rp.horario = $horario THEN rp.unidadesProducidas ELSE 0 END) AS h_$horario";
    }
    $columnasSQL = ", " . implode(', ', $columnas);  // Coma inicial importante
}

// Consulta principal (corregida)
$query = "SELECT
            o.op_id,
            o.nombre AS Operario,
            o.posicion,
            o.modulo,
            o.posicion
            $columnasSQL
          FROM operarios o
          LEFT JOIN registro_produccion rp 
            ON o.op_id = rp.op_id AND DATE(rp.fecha) = '$fechaFiltro'
          GROUP BY o.op_id, o.nombre
          ORDER BY o.posicion ASC";

$result = $mysqli->query($query);
if (!$result) {
    die(json_encode([
        "ok" => false,
        "error" => "Error en consulta principal: " . $mysqli->error,
        "query" => $query  // Para depuración
    ]));
}

// Formatear resultados
$data = [];
while ($row = $result->fetch_assoc()) {
    $operarioData = [
        'Operario' => $row['Operario'],
        'op_id' => (int)$row['op_id'],
        'modulo' => (int)$row['modulo'],
        'posicion' => (int)$row['posicion']
    ];
    
    foreach ($horarios as $horario) {
        $horaFormateada = formatHour($horario);
        $operarioData[$horaFormateada] = $row["h_$horario"] ?? 0;
    }
    
    $data[] = $operarioData;
}

function formatHour($horario) {
    $hora = $horario + 6;
    return date("g A", strtotime("$hora:00"));
}

echo json_encode([
    "ok" => true,
    "fecha" => $fechaFiltro,
    "horarios" => $horarios,  // Para debug
    "respuesta" => $data
], JSON_PRETTY_PRINT);

$mysqli->close();