<?php 
   require_once '../config/cors.php';
   require_once '../config/baseDeDatos.php';
   
   if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
       $id = $_GET['id'] ?? null;
   
       // Validación completa del ID
       if (!$id || !is_numeric($id)) {
           http_response_code(400);
           echo json_encode([
               'ok' => false,
               'respuesta' => 'ID inválido o no proporcionado'
           ]);
           exit;
       }
   
       // Preparar consulta con manejo de errores
       if (!$stmt = $mysqli->prepare('DELETE FROM registro_produccion WHERE regProd_id = ?')) {
           http_response_code(500);
           echo json_encode([
               'ok' => false,
               'respuesta' => 'Error al preparar consulta: ' . $mysqli->error
           ]);
           exit;
       }
   
       $stmt->bind_param('i', $id);
       
       if (!$stmt->execute()) {
           http_response_code(500);
           echo json_encode([
               'ok' => false,
               'respuesta' => 'Error al ejecutar consulta: ' . $stmt->error
           ]);
           exit;
       }
   
       // Verificar filas afectadas
       if ($stmt->affected_rows > 0) {
           http_response_code(200);
           echo json_encode([
               'ok' => true,
               'respuesta' => 'Registro eliminado exitosamente'
           ]);
       } else {
           http_response_code(response_code: 404);
           echo json_encode(value: [
               'ok' => false,
               'respuesta' => 'No se encontró el registro'
           ]);
       }
   
       $stmt->close();
       $mysqli->close();
   } else {
       http_response_code(405);
       echo json_encode([
           'ok' => false,
           'respuesta' => 'Método no permitido'
       ]);
   }
?>