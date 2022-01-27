const { Socket } = require("socket.io");
const { comprobarJWTSocket } = require("../helpers/generate-token");
const ChatMensajes = require("../models/mensajes");

const chatMensajes = new ChatMensajes();

//pasamos el io para poder tener una instancia global de nuestro servidor de sockets
const socketController = async (socket, io) => {
  console.log("Se vuelve a repetir");
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
  chatMensajes.cargarChatGlobales();
  io.emit("usuarios-activos", chatMensajes.usuariosConectados);
  io.emit("recibir-mensajes", chatMensajes.ultimos10);

  //LIMPIAR USUARIO DESCONECTADO
  socket.on("disconnect", () => {
    chatMensajes.guardarBD();
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit("usuarios-activos", chatMensajes.usuariosConectados);
  });

  /*socket.on("enviar-mensaje", (payload) => {
    //como ya recibimos en el payload el mensaje del usuario, podemos emitirlo a todos los usuarios

    const { uid, mensaje, tipo } = payload;

    console.log(tipo);

    if (uid) {
      const nombreBase = "de:" + usuario.uid;
      chatMensajes.guardarBD(tipo, nombreBase);
      chatMensajes.enviarMensajePrivado(usuario.uid, usuario.nombre, mensaje);
      socket
        .to(uid)
        .emit("mensaje-privado", { de: usuario.nombre, mensaje, tipo });
      //  io.emit("usuarios-activos", chatMensajes.usuariosConectados);
    } else {
      chatMensajes.guardarBD(tipo);
      chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje);

      io.emit("recibir-mensajes", chatMensajes.ultimos10);
      // io.emit("usuarios-activos", chatMensajes.usuariosConectados);
    }
  });*/

  socket.on("enviar-mensaje", ({ uid, mensaje, tipo }) => {
    let nombreBase;
    if (uid) {
      console.log(usuario.nombre);
      nombreBase = `de:${usuario.nombre}`;
      console.log(nombreBase);

      //chatMensajes.guardarBD(tipo, nombreBase);
      chatMensajes.enviarMensajePrivado(usuario.uid, usuario.nombre, mensaje);
      // Mensaje privado
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
      io.emit("recibir-mensajes-privados", chatMensajes.ultimos10Privados);
    } else {
      nombreBase = "global";

      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);

      io.to("videojuegos").emit("recibir-mensajes", chatMensajes.ultimos10);
    }
  });

  socket.on("cargar-todo", (payload) => {
    socket.join("videojuegos");
    io.emit("recibir-mensajes", chatMensajes.ultimos10);
  });

  socket.on("grabar-mensajes-privados", (payload) => {
    const involucrados = usuario.correo + "-" + payload;

    chatMensajes.guardarPrivadosBD(involucrados);
  });
};

module.exports = { socketController };
