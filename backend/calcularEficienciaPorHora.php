<?php 
require_once 'config/cors.php';
require_once 'baseDeDatos.php';
        #FECHA ACTUAL
         $fechaVerificar = new DateTime(date("H:i:s"));
         #DISTRIBUCION DE HORARIOS POR HORA
         $horario1 = new DateTime("06:00:00");
         $horario1Fin = new DateTime("06:59:59");
         $horario2 = new DateTime("07:00:00");
         $horario2Fin = new DateTime("07:59:59");
         $horario3 = new DateTime("08:00:00");
         $horario3Fin = new DateTime("08:59:59");
         $horario4 = new DateTime("11:00:00");
         $horario4Fin = new DateTime("15:59:59");

        # VERIFICAR Y ESTABLECER EL HORARIO EN EL CUAL SE ENCUENTRAN ACTUALMENTE
                if ($fechaVerificar >= $horario1 && $fechaVerificar <= $horario1Fin) {

                    $horarioActualInicio = $horario1->format("H:i:s");
                    $horarioActualFin = $horario1Fin->format("H:i:s");

                } elseif($fechaVerificar >= $horario2 && $fechaVerificar <= $horario2Fin) {

                    $horarioActualInicio = $horario2->format("H:i:s");
                    $horarioActualFin = $horario2Fin->format("H:i:s");

                } elseif($fechaVerificar >= $horario3 && $fechaVerificar <= $horario3Fin) {

                    $horarioActualInicio = $horario3->format("H:i:s");
                    $horarioActualFin = $horario3Fin->format("H:i:s");

                } elseif($fechaVerificar >= $horario4 && $fechaVerificar <= $horario4Fin) {

                    $horarioActualInicio = $horario4->format("H:i:s");
                    $horarioActualFin = $horario4Fin->format("H:i:s");
                } else {
                    echo "No te encuentras en jornada";
                }
        
         $query = "SELECT
                    RP.fecha,
                    O.nombre AS NombreOperario,
                    R.referencia AS Referencia,
                    RP.unidadesProducidas,
                    RP.MetaPorEficiencia AS MetaAjustada
                    FROM registro_produccion RP
                    JOIN Operarios O ON RP.op_id = O.op_id
                    JOIN Referencias R ON RP.ref_id = R.ref_id
                    WHERE TIME(RP.fecha) BETWEEN '$horarioActualInicio' AND '$horarioActualFin';";
          $result = mysqli_query($mysqli, $query) or die(mysqli_error($mysqli));


            while ($row = mysqli_fetch_array($result)) {

                 # CALCULAR EFICIENCIA POR HORA
                $eficiencia = ($row["unidadesProducidas"] / floor($row["MetaAjustada"])) * 100;
                echo "Eficiencia por hora: ". floor($eficiencia) ."% <br>";

                echo "Fecha: " . $row['fecha'] . "<br>";
                echo "Operario: " . $row['NombreOperario'] . "<br>";
                echo "Referencia: " . $row['Referencia'] . "<br>";
                echo "Unidades producidas: " . $row['unidadesProducidas'] . "<br><br>";
                echo "Meta por hora: " . floor($row["MetaAjustada"]) . "<br>";

                
            

            }
            mysqli_free_result($result);
?>