<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumen remision</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <style>
        @media print {
            .noImprimir {
                display: none;
            }
        }
    </style>
</head>
<body class="container p-5">
<?php 
require_once '../config/cors.php';
require_once '../config/baseDeDatos.php';
 if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: text/html');
    $numeroRemision = (int)$_GET['remision']?? null;
    $remisionFormateada = str_pad($numeroRemision, 3, '0', STR_PAD_LEFT);
    $query = "SELECT
        b.orden_produccion,
        r.referencia,
        b.detalle,
        b.color,
        b.talla,
        SUM(unidadesDespachadas + segundasDespachadas) as total_unidades,
        br.numeroDeRemision
    FROM
        `bodega_remision` br
    JOIN bodega b ON
        b.odp_id = br.odp_id
    JOIN referencias r ON
		r.ref_id = b.ref_id
    WHERE
        br.numeroDeRemision = ?
    GROUP BY
        br.odp_id;";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $numeroRemision);
    if($stmt->execute()) {
        $resultado = $stmt->get_result();
    $registros = $resultado->fetch_all(MYSQLI_ASSOC);

    ?>
    <h1>Resumen de remision #<?=$remisionFormateada?></h1>
    <table style="max-width: 80vw" class="table table-bordered">
        <thead>
            <tr>
                <th>Orden de produccion</th>
                <th>Referencia</th>
                <th>Detalle</th>
                <th>Color</th>
                <th>Talla</th>
                <th>Unidades despachadas</th>
            </tr>
        </thead>
        <?php 
            foreach($registros as $registro) {
                ?>
                    <tr>
                        <td><?=$registro['orden_produccion']?></td>
                        <td><?=$registro['referencia']?></td>
                        <td><?=$registro['detalle']?></td>
                        <td><?=$registro['color']?></td>
                        <td><?=$registro['talla']?></td>
                        <td><?=$registro['total_unidades']?></td>
                    </tr>
                <?php
            }
        ?>
    </table>
    <?php
    } else {
        $respuesta = [
            'ok' => false,
            'mensaje' => 'No se encontraron registros'
        ];
    }
    }
?>
<div class="noImprimir">
<button class=" btn btn-primary " onclick={window.print()}>Imprimir</button>

</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
</html>