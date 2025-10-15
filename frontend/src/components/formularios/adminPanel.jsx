import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
// Asegúrate de que este hook ya devuelva el objeto 'socket'
import { useSocketListener } from '../../hooks/useSocketListener'; 

function AdminPanel() {
    // 1. Obtener la conexión socket
    const { socket } = useSocketListener(); 
    
    // 2. Estados para el formulario y el feedback
    const [pantallaId, setPantallaId] = useState(null); 
    const [mensaje, setMensaje] = useState('¡Reporte en vivo! Cambiando a Gráficos.');
    const [estadoEnvio, setEstadoEnvio] = useState(null); // { type: 'success' | 'danger', msg: '...' }

    const handleSubmit = (e) => {
        e.preventDefault();
        setEstadoEnvio(null); // Limpiar feedback anterior

        if (!socket || socket.disconnected) {
            setEstadoEnvio({ type: 'danger', msg: '❌ Error: El servidor WebSocket está desconectado.' });
            return;
        }

        // 3. Definir la data a enviar
        const commandData = {
            id: pantallaId,
            msg: mensaje
        };

        // 4. ENVIAR EL COMANDO
        socket.emit('send_command', commandData);
        
        setEstadoEnvio({ type: 'success', msg: `✅ Comando '${pantallaId}' enviado a todos los clientes.` });
    };

    const isConnected = socket && socket.connected;
    const socketStatusText = isConnected ? 'Conectado' : 'Desconectado';
    const socketStatusVariant = isConnected ? 'success' : 'danger';

    return (
        <Container className="mt-5">
            <Card>
                <Card.Header as="h5">Panel de Control de Pantallas</Card.Header>
                <Card.Body>
                    {/* Indicador de estado del WebSocket */}
                    <Alert variant={socketStatusVariant} className="text-center">
                        Estado del servicio: <strong>{socketStatusText}</strong>
                    </Alert>

                    {/* Feedback de envío */}
                    {estadoEnvio && (
                        <Alert variant={estadoEnvio.type}>
                            {estadoEnvio.msg}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        {/* Campo ID de Pantalla */}
                        <Form.Group className="mb-3">
                            <Form.Label>ID de Pantalla a Mostrar:</Form.Label>
                            <Form.Control
                                type="text"
                                value={pantallaId}
                                onChange={(e) => setPantallaId(e.target.value)}
                                required
                                placeholder="Ej: 1(Gráficos) o 2(Mensajes)"
                            />
                            <Form.Text muted>
                                1(Gráficos) o 2(Mensajes)
                            </Form.Text>
                        </Form.Group>

                        {/* Campo Mensaje de Notificación */}
                        <Form.Group className="mb-3">
                            <Form.Label>Mensaje de Notificación:</Form.Label>
                            <Form.Control
                                type="text"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Botón de envío */}
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={!isConnected} // Deshabilitar si no hay conexión WS
                        >
                            Envíar Comando
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminPanel;