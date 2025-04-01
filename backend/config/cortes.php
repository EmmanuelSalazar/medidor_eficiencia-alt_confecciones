<?php 

$cortesJson = file_get_contents('../config/json/cortes.json');
$cortesJson = json_decode($cortesJson, true);
    $fechongas = date('m');
    $fechongas -= 1;
    $fechongas = $cortesJson[$fechongas];
    $fechaDia = date('d');

    if ($fechaDia < 15) {
        $fechaCorteInicial = date("Y-"). $fechongas["primerCorte"][0]["fechaInicial"];
        $fechaCorteFinal =  date("Y-"). $fechongas["primerCorte"][0]["fechaFinal"];
    } else {
        $fechaCorteInicial = date("Y-"). $fechongas["segundoCorte"][0]["fechaInicial"];
        $fechaCorteFinal =  date("Y-"). $fechongas["segundoCorte"][0]["fechaFinal"];
    }


?>