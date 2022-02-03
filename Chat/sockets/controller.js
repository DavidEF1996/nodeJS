const { Socket } = require("socket.io");
const {
  comprobarJWTSocket,
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
} = require("../helpers/generate-token");
const ChatMensajes = require("../models/mensajes");

const chatMensajes = new ChatMensajes();

//pasamos el io para poder tener una instancia global de nuestro servidor de sockets
const socketController = async (socket, io) => {
  const usuario = await comprobarJWTSocket(socket.handshake.headers["x-token"]);

  if (!usuario) {
    socket.disconnect();
  }

  //ahora podemos usar una nueva forma de emitir usando el io

  //1. Agregar usuario conectado
  chatMensajes.agregarUsuarios(usuario);
  io.emit("recibir-mensajes", chatMensajes.ultimos10);

  //1.1 Agregar usuario a sala
  socket.join(usuario.correo);

  //CARGAR LISTA DE USUARIOS
  //chatMensajes.cargarChatGlobales();
  io.emit("usuarios-activos", chatMensajes.usuariosLista(usuario.id));
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

  socket.on("enviar-mensaje", async ({ uid, mensaje, tipo, sala }) => {
    let nombreBase;
    if (uid) {
      const busqueda = await buscarUsuarioPorCorreo(uid);

      const involucrados = usuario.id + "-" + busqueda.id;

      //chatMensajes.guardarBD(tipo, nombreBase);
      chatMensajes.enviarMensajePrivado(
        usuario.uid,
        usuario.nombre,
        mensaje,
        involucrados
      );
      // Mensaje privado
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });

      socket.to(busqueda.correo).emit("recibir-mensajes-privados", {
        salaGlobal: sala == "" ? "privado" : sala,
        mensajes: chatMensajes.obtenerUltimos10Privados(sala, involucrados),
      });

      socket.emit("recibir-mensajes-privados", {
        salaGlobal: sala == "" ? "privado" : sala,
        mensajes: chatMensajes.obtenerUltimos10Privados(sala, involucrados),
      });
    } else {
      nombreBase = "global";

      if (sala === "videojuegos") {
        chatMensajes.enviarMensaje(
          usuario.id,
          usuario.nombre,
          mensaje,
          "",
          sala
        );
        io.to(sala).emit("recibir-mensajes", {
          salaGlobal: sala,

          mensajes: chatMensajes.obtenerUltimos10(sala),
        });
      } else if (sala === "peliculas") {
        chatMensajes.enviarMensaje(
          usuario.id,
          usuario.nombre,

          mensaje,
          "",
          sala
        );
        io.to(sala).emit("recibir-mensajes", {
          salaGlobal: sala,

          mensajes: chatMensajes.obtenerUltimos10(sala),
        });
      }
    }
  });

  socket.on("cargar-todo", (payload) => {
    socket.join(payload);

    socket.emit("recibir-mensajes", {
      salaGlobal: payload,
      mensajes: chatMensajes.obtenerUltimos10(payload),
    });
  });

  socket.on("listar-por-usuario", async (payload) => {
    const { sala, uid } = payload;

    const busqueda = await buscarUsuarioPorCorreo(uid);

    const involucrados = usuario.id + "-" + busqueda.id;

    socket.emit("recibir-mensajes-privados", {
      salaGlobal: sala == "" ? "privado" : sala,
      mensajes: chatMensajes.obtenerUltimos10Privados(sala, involucrados),
    });
  });

  socket.on("grabar-mensajes-privados", (payload) => {
    const involucrados = usuario.correo + "-" + payload;

    chatMensajes.guardarPrivadosBD(involucrados);
  });
};

module.exports = { socketController };
