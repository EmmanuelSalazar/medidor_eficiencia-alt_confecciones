import { useEffect, useState }  from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://ws-services.altconfecciones.local:4000';

export function useSocketListener() {
    const [pantallaActiva, setPantallaActiva] = useState(null);
    const [notificacion, setNotificacion] = useState(null);
    const [socket, setSocket] = useState(null); 

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        newSocket.on('connect', () => {
            console.log('Conectado al servidor de sockets');
        });

        newSocket.on('ui_update', (data) => {
            setPantallaActiva(data.pantallaId);
            setNotificacion(data);

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