let usuarioGlobal = null; // información del usuario conectado

let socket = null; //info de el socekt

principal();
async function principal() {
  await validarJWT();
}

async function validarJWT() {
  const recibirToken = localStorage.getItem("token") || "";
  console.log("El token de la página: " + recibirToken);

  if (recibirToken === "" || recibirToken.length < 10) {
    window.location = "index.html";
    throw new Error("El token no existe o no es válido");
  }

  //hasta esta parte ya se valida que entre a esa ventana solo con un token

  const url = "http://localhost:8080/api/auth/";
  const respuesta = await fetch(url, {
    headers: { "x-token": recibirToken },
  });

  const { usuario, token } = await respuesta.json();

  //podemos cambiar el token en cada iteracción
  localStorage.setItem("token", token);
  usuarioGlobal = usuario;
  document.title = usuarioGlobal.nombre;

  await conectar();
}

async function conectar() {
  socket = new io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Se conecto");
  });

  socket.on("disconnect", () => {
    console.log("Se desconecto");
  });

  //Tiene que escuchar los métodos para recibir mensajes y usuarios activos y mensajes privados
  socket.on("recibir-mensajes", () => {});

  socket.on("usuarios-activos", () => {});

  socket.on("mensaje-privado", () => {});
}
