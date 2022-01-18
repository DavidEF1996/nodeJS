// Referencias del HTML
const lblTicket = document.querySelector("#lblNuevoTicket");
const boton = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  // console.log('Conectado');

  boton.disabled = false;
});

socket.on("disconnect", () => {
  // console.log('Desconectado del servidor');

  boton.disabled = true;
});

//escuchar el mensaje del back
socket.on("ultimo-ticket", (ticket) => {
  lblTicket.innerText = "Ticket " + ticket;
});

//evento de enviar el mensaje
boton.addEventListener("click", () => {
  socket.emit("siguiente-ticket", null, (ticket) => {
    lblTicket.innerText = ticket;
  });
});
