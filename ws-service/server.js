const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Puerto de tu app React Admin/Visualización
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('Un cliente de react se ha conectado con id:', socket.id);

  socket.on('send_command', (data) => {
    const { id, msg } = data;
    
    // Validación de parámetros
    if(!id || !msg) { 
      // Enviamos un error de vuelta solo al cliente que envió el comando
      return socket.emit('ui_update', { error: 'Faltan parámetros en la solicitud.'});
    }

    // Envía el mensaje a TODOS los demás clientes conectados (menos al que lo envió)
        console.log(`[WS] Reenviando comando: ${id} | Mensaje: ${msg}`);
    socket.broadcast.emit('ui_update', {
      pantallaId: id,
      mensaje: msg
    });
  });

  socket.on('disconnect', () => {
    console.log('Un cliente de react se ha desconectado con id:', socket.id);
  });
});


const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Servidor NodeJS funcionando en el puerto ${PORT}`);
})