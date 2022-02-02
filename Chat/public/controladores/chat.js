let usuarioGlobal = null; // información del usuario conectado
let socket = null; //info de el socekt
let sala = "";

//Variables de interfaz
const listaUsuariosConectados = document.querySelector("#ulUsuarios");
const enviarMensaje = document.querySelector("#txtMensaje");
const idMensaje = document.querySelector("#correo-chat");
const contenedorMensajes = document.querySelector("#ulMensajes");
const juegos = document.querySelector("#videojuegos");
const peliculas = document.querySelector("#peliculas");
const cine = document.querySelector("#peliculas");

principal();
async function principal() {
  await validarJWT();
}

async function validarJWT() {
  const recibirToken = localStorage.getItem("token") || "";

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
  socket.on("recibir-mensajes", dibujarMensajes);

  socket.on("usuarios-activos", dibujarUsuarios);

  socket.on("recibir-mensajes-privados", dibujarMensajes);

  socket.on("mensaje-privado", (payload) => {
    console.log(payload);
  });
}

/*async function usuariosConectados(usuarios = []) {
  limpiarHtml();

  usuarios.forEach((element) => {
    if (usuarioGlobal.uid !== element.uid) {
      //    console.log(usuarioGlobal.uid);
      //  console.log(element.id);
      const li = document.createElement("li");
      li.id = element.correo;
      li.classList.add("users");
      li.textContent = element.nombre;
      li.value = element.correo;
      li.onclick = async () => {
        await obtenerChat(element.correo);
      };
      listaUsuariosConectados.appendChild(li);
    }
  });
}*/

const dibujarUsuarios = (usuarios = []) => {
  let usersHtml = "";
  usuarios.forEach(({ nombre, uid, correo }) => {
    if (usuarioGlobal.uid !== usuarios.uid) {
      usersHtml += `
          <li class="users" id="${correo}">
              <p>
                  <h5 class="text-success"> ${nombre} </h5>
              </p>
          </li>
      `;
    }
  });

  listaUsuariosConectados.innerHTML = usersHtml;
  const listaUsuarios = document.querySelectorAll("#ulUsuarios li");

  for (let index = 0; index < listaUsuarios.length; index++) {
    listaUsuarios[index].onclick = async () => {
      await obtenerChat(usuarios[index].correo);
      socket.emit("listar-por-usuario", usuarios[index].correo);
    };
  }
};

/*function listaMensajes(mensajes = []) {
  limpiarHtml();
  let mensaje = "";
  mensajes.forEach((element) => {
    const li = document.createElement("li");
    mensaje += `<li>
    <p>
    <span>${element.nombre}:</span>
    <span>${element.mensaje}</span>
    </p>
    </li>
    `;
  });
  contenedorMensajes.innerHTML = mensaje;
}*/

const dibujarMensajes = (data = []) => {
  const { salaGlobal, mensajes = [] } = data;
  let mensajesHTML = "";

  const idMensaje = document.querySelector(".receptor").textContent;

  if (salaGlobal === sala) {
    mensajes.forEach(({ nombre = "", mensaje }) => {
      mensajesHTML += `
          <li >
              <p>
                  <span class="text-primary">${nombre}: </span>
                  <span>${mensaje}</span>
              </p>
          </li>
      `;
    });

    contenedorMensajes.innerHTML = mensajesHTML;
    // if (nombre.trim() == idMensaje.trim()) {

    const listaUsuarios = document.querySelectorAll("#ulMensajes li p");
    const listaUsu3 = document.querySelectorAll(
      "#ulMensajes li p .text-primary"
    );

    for (let index = 0; index < listaUsuarios.length; index++) {
      if (listaUsu3[index].textContent.split(":")[0] == idMensaje.trim()) {
        listaUsuarios[index].style.textAlign = "left";
      } else {
        listaUsuarios[index].style.textAlign = "right";
      }
    }
    console.log(listaUsuarios.length);
  }
};

enviarMensaje.addEventListener("keyup", ({ keyCode }) => {
  if (keyCode !== 13) {
    return;
  }
  const mensaje = enviarMensaje.value;
  const uid = idMensaje.textContent;
  let tipo = false;

  if (mensaje.length === 0) {
    return;
  }
  if (uid.length !== 0) {
    tipo = true;
    socket.emit("enviar-mensaje", { uid, mensaje, tipo, sala });

    socket.on("usuarios-activos", (payload) => {});
  } else {
    tipo = false;

    socket.emit("enviar-mensaje", { uid, mensaje, tipo, sala });
    socket.on("usuarios-activos", (payload) => {});
  }
});

function limpiarHtml() {
  while (listaUsuariosConectados.firstChild) {
    listaUsuariosConectados.removeChild(listaUsuariosConectados.firstChild);
  }
}

function entrarSala(sala = "") {
  switch (sala) {
    case "videojuegos":
      socket.emit("conectar-sala", sala);
      break;

    case "peliculas":
      socket.emit("conectar-sala", sala);
      break;

    default:
      break;
  }
}

//addevenlisteners

juegos.addEventListener("click", (e) => {
  // const obtener = document.querySelector("#videojuegos").id;
  while (contenedorMensajes.firstChild) {
    contenedorMensajes.removeChild(contenedorMensajes.firstChild);
  }

  //  entrarSala(obtener);

  sala = "videojuegos";

  socket.emit("cargar-todo", sala);
});

peliculas.addEventListener("click", (e) => {
  // const obtener = document.querySelector("#videojuegos").id;
  while (contenedorMensajes.firstChild) {
    contenedorMensajes.removeChild(contenedorMensajes.firstChild);
  }

  //  entrarSala(obtener);

  sala = "peliculas";

  socket.emit("cargar-todo", sala);
});

//Listener para cambiar entre ventanas de chat

async function obtenerChat(correo) {
  sala = "privado";
  //obtenemos todos los li de usuarios
  // socket.emit("grabar-mensajes-privados", correo);
  while (contenedorMensajes.firstChild) {
    contenedorMensajes.removeChild(contenedorMensajes.firstChild);
  }

  const chatCon = document.querySelector(".receptor");
  const correoCon = document.querySelector("#correo-chat");

  const listaUsuarios = document.querySelectorAll("#ulUsuarios li");

  for (let index = 0; index < listaUsuarios.length; index++) {
    /* if (listaUsuarios[index].correo === correo) {
      chatCon.value = listaUsuarios.nombre;
    }*/

    if (listaUsuarios[index].id === correo) {
      chatCon.textContent = listaUsuarios[index].textContent;
      correoCon.textContent = correo;
    }
  }
}
