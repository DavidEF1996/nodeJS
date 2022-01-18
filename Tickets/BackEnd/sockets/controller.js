const TicketControll = require("../models/ticket-controller");

const ticketController = new TicketControll(); //aquí se ejecuta la inicialización del controlador de tickets

const socketController = (socket) => {
  socket.emit("ultimo-ticket", ticketController.ultimo); // con el emit mandamos un mensaje, con el on escuchamos el mensaje
  socket.broadcast.emit("ultimos-cuatro", ticketController.ultimos4);

  socket.emit("restantes", ticketController.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketController.siguiente(); // retorna el mensaje del siguiente ticket y el numeor

    callback(siguiente); // enviamos por función callback el siguiente para recibir en el front end

    //Todo: notificar ticket pendiente
  });

  socket.on("atender-ticket", (payload, callback) => {
    const { escritorio } = payload;
    console.log(escritorio);

    if (!escritorio) {
      return callback({
        ok: false,
        msg: "Falta el escritorio",
      });
    }
    const ticket = ticketController.atenderTicket(escritorio);
    socket.broadcast.emit("ultimos-cuatro", ticketController.ultimos4);
    socket.emit("restantes", ticketController.tickets.length);
    if (!ticket) {
      callback({
        ok: false,
        msg: "ya no hay tickes",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
