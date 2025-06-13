<?php 
    require_once '../config/rutas.php';
    function obtenerCorte($fecha){
    $fecha = explode("-", $fecha);
    $cortesJson = file_get_contents(ROOT_PATH . '/config/json/cortes.json');
    $cortesJson = json_decode($cortesJson, true);
    $fechongas = $fecha[1] ?? date('m');
    $fechongas -= 1;
    $fechongas = $cortesJson[$fechongas];
    $fechaDia = $fecha[2] ?? date('d');
    if ($fechaDia < 15) {
        $fechaCorteInicial = date("Y-"). $fechongas["primerCorte"][0]["fechaInicial"];
        $fechaCorteFinal =  date("Y-"). $fechongas["primerCorte"][0]["fechaFinal"];
        return $fechasDeCortes = [$fechaCorteInicial, $fechaCorteFinal];

    } else {
        $fechaCorteInicial = date("Y-"). $fechongas["segundoCorte"][0]["fechaInicial"];
        $fechaCorteFinal =  date("Y-"). $fechongas["segundoCorte"][0]["fechaFinal"];
        return $fechasDeCortes = [$fechaCorteInicial, $fechaCorteFinal];
    }
}

?>