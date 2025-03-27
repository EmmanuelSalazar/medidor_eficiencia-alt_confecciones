<?php 

#FECHA ACTUAL
$fechaActual = new DateTime(date("H:i:s"));
$fechaDia = $fechaActual->format("Y-m-d");
#DISTRIBUCION DE HORARIOS POR HORA
$horario1 = new DateTime("06:00:00");
$horario1Fin = new DateTime("06:59:59");
$horario2 = new DateTime("07:00:00");
$horario2Fin = new DateTime("07:59:59");
$horario3 = new DateTime("08:00:00");
$horario3Fin = new DateTime("08:59:59");
$horario4 = new DateTime("11:00:00");
$horario4Fin = new DateTime("15:59:59");

?>