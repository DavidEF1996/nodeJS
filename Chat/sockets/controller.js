const { Socket } = require("socket.io");
const { comprobarJWTSocket } = require("../helpers/generate-token");

const socketController = async (socket) => {
  const usuario = await comprobarJWTSocket(socket.handshake.headers["x-token"]);

  if (!usuario) {
    socket.disconnect();
  }

  console.log("Conectado: " + usuario.nombre);
};

module.exports = { socketController };
