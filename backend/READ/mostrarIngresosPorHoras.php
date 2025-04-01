<?php
require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';
// Obtener la fecha seleccionada (por defecto, hoy)
$fechaFiltro = $_GET['fecha'] ?? date('Y-m-d');

// Obtener el módulo seleccionado (si existe)
$moduloFiltro = null;
if (!empty($_GET['modulo']) && is_numeric($_GET['modulo'])) {
    $moduloFiltro = intval($_GET['modulo']);
}

// Consultar horarios únicos para la fecha y módulo seleccionados
$horasQuery = "
    SELECT DISTINCT rp.horario 
    FROM registro_produccion rp
    INNER JOIN operarios o ON rp.op_id = o.op_id
    WHERE DATE(rp.fecha) = '$fechaFiltro'
";

if ($moduloFiltro) {
    $horasQuery .= " AND o.modulo = $moduloFiltro";
}

$horasQuery .= " ORDER BY rp.horario ASC";

$horasResult = $mysqli->query($horasQuery);
if (!$horasResult) {
    die("Error en la consulta de horarios: " . $mysqli->error);
}

$horarios = [];
while ($row = $horasResult->fetch_assoc()) {
    $horarios[] = $row['horario'];
}

// Construir las columnas dinámicas basadas en los horarios
$columnas = [];
foreach ($horarios as $horario) {
    $columnas[] = "SUM(CASE WHEN rp.horario = $horario THEN rp.unidadesProducidas ELSE 0 END) AS h_$horario";
}

$columnasSQL = implode(', ', $columnas);

// Consulta principal para obtener los datos
$query = "
    SELECT 
        o.op_id,
        o.nombre AS Operario,
        $columnasSQL
    FROM 
        operarios o
    LEFT JOIN 
        registro_produccion rp ON o.op_id = rp.op_id AND DATE(rp.fecha) = '$fechaFiltro'
";

if ($moduloFiltro) {
    $query .= " WHERE o.modulo = $moduloFiltro";
}

$query .= "
    GROUP BY 
        o.op_id, o.nombre
    ORDER BY 
        o.nombre
";

$result = $mysqli->query($query);
if (!$result) {
    die("Error en la consulta principal: " . $mysqli->error);
}

// Formatear los resultados
$data = [];
while ($row = $result->fetch_assoc()) {
    $operarioData = [
        'Operario' => $row['Operario'],
        'op_id' => $row['op_id']
    ];

    foreach ($horarios as $horario) {
        $horaFormateada = formatHour($horario);
        $operarioData[$horaFormateada] = $row["h_$horario"] ?? 0;
    }

    $data[] = $operarioData;
}

// Función para convertir horario a formato AM/PM
function formatHour($horario) {
    $hora = $horario + 6; // Mapear horario 1 → 6 AM, 2 → 7 AM, etc.
    return date("g A", strtotime("$hora:00"));
}

// Respuesta JSON
echo json_encode([
    "ok" => true,
    "respuesta" => $data
], JSON_PRETTY_PRINT);

// Cerrar conexión
$mysqli->close();
?>