<?php 
    require_once '../config/cors.php';
    require_once '../config/baseDeDatos.php';

    if($_SERVER['REQUEST_METHOD'] == 'GET') {

        $modulo = $_GET['modulo'] ?? NULL;
        $fechaInicio = $_GET['fecha_inicio'] ?? date('Y-m-d');
        $fechaFin = $_GET['fecha_fin'] ?? date('Y-m-d');
        if (!empty($fechaInicio) && !strtotime($fechaInicio)) {
            $respuesta["ok"] = false;
            $respuesta["respuesta"] = "La fecha de inicio no es válida.";
            echo json_encode($respuesta, JSON_PRETTY_PRINT);
            exit();
        }
    
        if (!empty($fechaFin) && !strtotime($fechaFin)) {
            $respuesta["ok"] = false;
            $respuesta["respuesta"] = "La fecha final no es válida.";
            echo json_encode($respuesta, JSON_PRETTY_PRINT);
            exit();
        }
        $sql = "SELECT
    O.nombre AS NombreOperario,
    RP.op_id as op_id,
    RP.rol AS Rol,
    O.Rol AS RolOperario,
    COALESCE(SUM(RP.unidadesProducidas), 0) AS TotalUnidadesProducidas,
    ROUND(COALESCE(SUM(RP.MetaPorEficiencia), 0), 0) AS TotalMeta,
    ROUND(COALESCE((SUM(RP.unidadesProducidas) / SUM(RP.MetaPorEficiencia) * 100), 0), 1) AS Eficiencia, -- Evita NULLs
    COALESCE(
		CASE
			WHEN COUNT(DISTINCT CASE WHEN RP.modulo = 1 THEN DATE(RP.fecha) END) >= 11
		 	THEN 'Ok'
			ELSE COUNT(DISTINCT CASE WHEN RP.modulo = 1 THEN DATE(RP.fecha) END)
		END
	, 0) AS modulo_1,
	COALESCE(
		CASE
			WHEN COUNT(DISTINCT CASE WHEN RP.modulo = 2 THEN DATE(RP.fecha) END) >= 11
		 	THEN 'Ok'
			ELSE COUNT(DISTINCT CASE WHEN RP.modulo = 2 THEN DATE(RP.fecha) END)
		END
	, 0) AS modulo_2,
	COALESCE(
		CASE
			WHEN COUNT(DISTINCT CASE WHEN RP.modulo = 3 THEN DATE(RP.fecha) END) >= 11
		 	THEN 'Ok'
			ELSE COUNT(DISTINCT CASE WHEN RP.modulo = 3 THEN DATE(RP.fecha) END)
		END
	, 0) AS modulo_3,
	COALESCE(
		CASE
			WHEN COUNT(DISTINCT CASE WHEN RP.modulo = 4 THEN DATE(RP.fecha) END) >= 11
		 	THEN 'Ok'
			ELSE COUNT(DISTINCT CASE WHEN RP.modulo = 4 THEN DATE(RP.fecha) END)
		END
	, 0) AS modulo_4
    FROM
        operarios O -- Tabla principal para listar TODOS los operarios
    LEFT JOIN registro_produccion RP 
        ON O.op_id = RP.op_id 
        AND DATE(RP.fecha) BETWEEN ? AND ? ";

        $tipos = "ss";
        $parametros[] = $fechaInicio;
        $parametros[] = $fechaFin;

    if (!empty($modulo) && is_numeric($modulo)) {
        $sql .= "WHERE O.modulo = ? ";
        $tipos .= "i";
        $parametros[] = $modulo;
    }
    $sql .= "GROUP BY
            O.op_id, O.nombre -- Agrupa por nombre para evitar ambigüedades
        ORDER BY
            O.posicion ASC; ";

            $stmt = $mysqli->prepare($sql);
        try {
            $stmt->bind_param($tipos, ...$parametros);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
            'ok' => false,
            'respuesta' => 'Error al enlazar parámetros: ' . $e->getMessage()
        ]);
        exit();
        }


        
        if ($stmt->execute()) {
            $sql = $stmt->get_result();
            $sql = $sql->fetch_all(MYSQLI_ASSOC);

            $data = $sql;
            $sql = 'SELECT rp.fecha, o.nombre, (SUM(unidadesProducidas) / SUM(MetaPorEficiencia) * 100) as Eficiencia_dia FROM `registro_produccion` rp JOIN operarios o ON rp.op_id = o.op_id  WHERE DATE(fecha) BETWEEN ? AND ? AND rp.op_id = ? GROUP BY DATE(fecha)';
            foreach ($data as $key => $value) {
                $stmt = $mysqli->prepare($sql);
                $stmt->bind_param("sss", $fechaInicio, $fechaFin, $value['op_id']);
                $stmt->execute();
                $result = $stmt->get_result();
                $result = $result->fetch_all(MYSQLI_ASSOC);
                $data[$key]['PromedioEficiencia'] = number_format(array_sum(array_column($result, 'Eficiencia_dia')) / count($result), 1);
            }


            $respuesta = [
                "ok" => true,
                "respuesta" => $data
            ];
            http_response_code(200);
            echo json_encode($respuesta, true);
        }
    } else {
        $respuesta = [
            "ok" => false,
            "respuesta" => "Metodo no permitido"
        ];
        http_response_code(405);
        echo json_encode($respuesta, true);
    }


?>