const escritorioH = document.querySelector("h1");
const boton = document.querySelector("button");
const nombre = document.querySelector("small");
const alerta = document.querySelector(".alert");
const pendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search); // con esto sacamos los parametros de la url

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("Falta el escritorio");
}

const escritorio = searchParams.get("escritorio");
escritorioH.innerText = escritorio;

console.log(escritorio);
alerta.style.display = "none";
const socket = io();

socket.on("restantes", (payload) => {
  pendientes.innerText = payload;
});
socket.on("connect", () => {
  // console.log('Conectado');

  boton.disabled = false;
});

socket.on("disconnect", () => {
  // console.log('Desconectado del servidor');

  boton.disabled = true;
});

//escuchar el mensaje del back
socket.on("ultimo-ticket", (ticket) => {});

//evento de enviar el mensaje
boton.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, (payload) => {
    console.log(payload);
    const { ok, ticket } = payload;

    if (!ok) {
      nombre.innerText = "Nadie";
      alerta.style.display = "block";
    } else {
      nombre.innerText = ticket.numero;
    }
  });
});
