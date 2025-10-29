import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useSocketListener } from '../../hooks/useSocketListener'; 
import { convertFileToBase64, UploadImage } from '../utils/ConvertAndUploadImage';

function AdminPanel() {
    const srv_key = import.meta.env.VITE_API_IMAGE_SERVICE_KEY;
    // 1. Obtener la conexión socket
    const { socket } = useSocketListener(); 
    
    // 2. Estados para el formulario y el feedback
    const [pantallaId, setPantallaId] = useState(null); 
    const [mensaje, setMensaje] = useState('¡Reporte en vivo! Cambiando a Gráficos.');
    const [imagen, setImagen] = useState(null);
    const [urlImagen, setUrlImagen] = useState(null);
    const [estadoEnvio, setEstadoEnvio] = useState(null); // { type: 'success' | 'danger', msg: '...' }
    var imgUrl;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoEnvio(null);

        if (!socket || socket.disconnected) {
            setEstadoEnvio({ type: 'danger', msg: '❌ Error: El servidor WebSocket está desconectado.' });
            return;
        }

        if(Number(pantallaId) === 3 && !imagen) {
            setEstadoEnvio({ type: 'danger', msg: '❌ Error: Debes subir una imagen.' });
            return;
        }

        if(imagen) {
            try {
                const base64String = await convertFileToBase64(imagen);
                console.log(base64String)
                const response = await UploadImage(base64String, srv_key);
                imgUrl = response.data.link;
                console.log(response.data.link)
            } catch (error) {
                setEstadoEnvio({ type: 'danger', msg: '❌ Error: No se pudo subir la imagen a Imgur.' });
                console.error('Error al subir la imagen a Imgur:', error);
            }
        }
        console.log(imgUrl)
        // 3. Definir la data a enviar
        const commandData = {
            id: pantallaId,  
            msg: mensaje,
            img: imgUrl
        };
        // 4. ENVIAR EL COMANDO
        socket.emit('send_command', commandData);
        
        setEstadoEnvio({ type: 'success', msg: `✅ Comando '${pantallaId}' enviado a todos los clientes.` });
        setImagen(null);
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
                                1(Gráficos) - 2(Mensajes) - 3(Imagen)
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
                                disabled={Number(pantallaId) === 3 || Number(pantallaId) === 1}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen a subir:</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImagen(e.target.files[0])}
                                required
                                disabled={Number(pantallaId) === 2 || Number(pantallaId) === 1}
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