<?php 

    function obtenerMeta($mysqli, $operario, $referencia, $modulo, $fecha, $minutesPerDay, $hoursPerDay) {
    $tiempoDeMontaje = NULL;
    $metaPorHora = 0;
    // OBTENER EL TIEMPO DE LA REFERENCIA
    $sql = 'SELECT tiempoDeProduccion FROM referencias WHERE ref_id = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $referencia);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $tiempoDeProduccion = $result['tiempoDeProduccion'];
    $stmt->close();

    // OBTENER TOTAL DE OPERARIOS EN EL MODULO
    $sql = 'SELECT COUNT(*) AS count FROM operarios WHERE modulo = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("s", $modulo);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $totalOperarios = $result['count'];
    $stmt->close();
    
    // CALCULAR TIEMPO DE PRODUCCION
    $metaPorHora = (($minutesPerDay * $totalOperarios) / $tiempoDeProduccion) / $hoursPerDay;
    $metaDelDia = ($minutesPerDay * $totalOperarios) / $tiempoDeProduccion;

    // CALCULAR ULTIMA HORA DEL DIA
    $sql = 'SELECT MAX(horario) as horario FROM registro_produccion WHERE DATE(fecha) = DATE(?) AND op_id = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ss", $fecha, $operario);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $horario = $result['horario'] + 1;
    $stmt->close();

    if ($horario === 9) {
        $ultimaMeta = $metaPorHora * 8;
        $metaPorHora = $metaDelDia - $ultimaMeta;
    }
    // OBTENER TIEMPO DE MONTAJE (SI HAY)
    $sql = 'SELECT tiempo FROM tiempo_de_montaje WHERE DATE(fecha) = DATE(?) AND modulo = ? AND horario = ? LIMIT 1';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("sss", $fechaString, $modulo, $horario);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    if($result) {
        $tiempoDeMontaje = $result['tiempo'];
    }
    $stmt->close();

    if($tiempoDeMontaje) {
        $ajusteMeta = ($tiempoDeMontaje * $totalOperarios) / $tiempoDeProduccion;
        $metaPorHora -= $ajusteMeta;
    }

    // VERIFICAR SI EL OPERARIO ES REVISOR O NO ES REVISOR
    $sql = 'SELECT rol FROM operarios WHERE op_id = ?';
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("s", $operario);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $rol = $result['rol'];
    $stmt->close();

    // SI EL OPERARIO ES REVISOR, LA META ES IGUAL A LA META DEL DIA
    if($rol == 2) {
        $metaPorHora *= 0.5;
    }
        return ceil($metaPorHora);
    }
?>