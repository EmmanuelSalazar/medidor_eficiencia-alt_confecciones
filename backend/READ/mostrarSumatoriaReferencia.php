<?php

require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';
$respuesta = [
    "ok" => false
];
if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $fechaInicial = $_GET['fecha_inicio'] ?? NULL;
    $fechaFinal = $_GET['fecha_final'] ?? NULL; 
    if (!$fechaFinal || !$fechaInicial) {
        $respuesta = [
            ...$respuesta,
            "respuesta" => "formulario incompleto"
        ];
        http_response_code(428);
        echo json_encode($respuesta, true);
    };

    $sql = "SELECT
                r.referencia,
                SUM(br.unidadesDespachadas) + SUM(br.segundasDespachadas) AS unidades
            FROM
                `bodega_remision` br
            JOIN bodega b ON
                br.odp_id = b.odp_id
            JOIN referencias r ON
                b.ref_id = r.ref_id
            WHERE
                DATE(fecha) BETWEEN ? AND ?
            GROUP BY
                r.ref_id;";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("ss", $fechaInicial, $fechaFinal );
        if ($stmt->execute()){

               $results = $stmt->get_result(); 
               $var = $results->fetch_all(MYSQLI_ASSOC);
               $respuesta = [
                "ok" => true,
               "respuesta" => $var
               ];

               echo json_encode ($respuesta, true);
        }else {
            $respuesta = [
                ...$respuesta, 
                "respuesta" => "Error de consulta"
            ];
            http_response_code(500);
            echo json_encode($respuesta, true);
        }

}else {
    $respuesta = [
        ...$respuesta,
        "respuesta" => "Metodo no permitido"
    ];
    http_response_code(405);
    echo json_encode($respuesta, true);
}


























?>