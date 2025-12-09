import { useEffect, useState }  from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export function useSocketListener() {
    const [pantallaActiva, setPantallaActiva] = useState(null);
    const [notificacion, setNotificacion] = useState(null);
    const [socket, setSocket] = useState(null); 

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        setSocket(newSocket);
        newSocket.on('connect', () => {
            console.log('Conectado al servidor websocket');
        });

        newSocket.on('ui_update', (data) => {
            setPantallaActiva(data.pantallaId);
            setNotificacion({
                mensaje: data.mensaje,
                img: data.img || null
            });

        })
        return () => {
            newSocket.disconnect();
            console.log('Desconectado del servidor de sockets');
        }
    }, [])
    return {
        pantallaActiva,
        notificacion,
        socket
    }   
}