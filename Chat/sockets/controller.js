const { Socket } = require("socket.io");
const { comprobarJWTSocket } = require("../helpers/generate-token");
const ChatMensajes = require("../models/mensajes");

const chatMensajes = new ChatMensajes();

//pasamos el io para poder tener una instancia global de nuestro servidor de sockets
const socketController = async (socket, io) => {
  const usuario = await comprobarJWTSocket(socket.handshake.headers["x-token"]);

  if (!usuario) {
    socket.disconnect();
  }
  console.log(usuario.correo);
  //ahora podemos usar una nueva forma de emitir usando el io

  //1. Agregar usuario conectado
  chatMensajes.agregarUsuarios(usuario);
  io.emit("recibir-mensajes", chatMensajes.ultimos10);

  //1.1 Agregar usuario a sala
  socket.join(usuario.correo);

  //CARGAR LISTA DE USUARIOS
  io.emit("usuarios-activos", chatMensajes.usuariosConectados);

  //LIMPIAR USUARIO DESCONECTADO
  socket.on("disconnect", () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit("usuarios-activos", chatMensajes.usuariosConectados);
  });

  socket.on("enviar-mensaje", (payload) => {
    //como ya recibimos en el payload el mensaje del usuario, podemos emitirlo a todos los usuarios

    const { uid, mensaje } = payload;

    console.log(payload);

    if (uid) {
      chatMensajes.guardarBD();
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
    } else {
      chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje);
      io.emit("recibir-mensajes", chatMensajes.ultimos10);
    }
  });
};

module.exports = { socketController };
