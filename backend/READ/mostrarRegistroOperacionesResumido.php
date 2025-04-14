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
    COALESCE(SUM(RP.unidadesProducidas), 0) AS TotalUnidadesProducidas,
    ROUND(COALESCE(SUM(RP.MetaPorEficiencia), 0), 1) AS TotalMeta,
    ROUND(COALESCE(AVG(RP.eficiencia), 0), 1) AS PromedioEficiencia, -- Evita NULLs
    COALESCE(
		CASE
			WHEN COUNT(DISTINCT CASE WHEN RP.modulo = 1 THEN DATE(RP.fecha) END) >= 10
		 	THEN 'Ok'
			ELSE COUNT(DISTINCT CASE WHEN RP.modulo = 1 THEN DATE(RP.fecha) END)
		END
	, 0) AS modulo_1,
	COALESCE(
		CASE
			WHEN COUNT(DISTINCT CASE WHEN RP.modulo = 2 THEN DATE(RP.fecha) END) >= 10
		 	THEN 'Ok'
			ELSE COUNT(DISTINCT CASE WHEN RP.modulo = 2 THEN DATE(RP.fecha) END)
		END
	, 0) AS modulo_2,
	COALESCE(
		CASE
			WHEN COUNT(DISTINCT CASE WHEN RP.modulo = 3 THEN DATE(RP.fecha) END) >= 10
		 	THEN 'Ok'
			ELSE COUNT(DISTINCT CASE WHEN RP.modulo = 3 THEN DATE(RP.fecha) END)
		END
	, 0) AS modulo_3,
	COALESCE(
		CASE
			WHEN COUNT(DISTINCT CASE WHEN RP.modulo = 4 THEN DATE(RP.fecha) END) >= 10
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
            O.op_id DESC; ";

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
            $respuesta = [
                "ok" => true,
                "respuesta" => $sql
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