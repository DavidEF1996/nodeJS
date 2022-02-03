const fs = require("fs");
class Mensaje {
  constructor(uid, nombre, mensaje, tipo, sala) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
    this.tipo = tipo;
    this.sala = sala;
  }
}
class MensajePrivado {
  constructor(uid, nombre, mensaje, involucrados) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
    this.involucrados = involucrados;
  }
}

class ChatMensajes {
  path = "./database/";
  constructor() {
    this.mensajes = []; //este es un arreglo que contendrá los mensajes
    this.mensajesPrivados = [];
    this.usuarios = {}; //todos los usuarios se guardaran como objetos
  }

  cargarChatGlobales() {
    this.leerBD();
  }

  get ultimos10() {
    return this.mensajes.slice(0, 10);
  }
  get ultimos10Privados() {
    return this.mensajesPrivados.slice(0, 10);
  }

  obtenerUltimos10(sala) {
    let arreglo = this.mensajes.filter((filtrado) => filtrado.sala === sala);
    return arreglo.slice(0, 10);
  }
  obtenerUltimos10Privados(sala, involucrados = "") {
    const opciones = involucrados.split("-");
    const opcion2 = opciones[1] + "-" + opciones[0];

    console.log(involucrados);
    console.log(opcion2);

    let arreglo = this.mensajesPrivados.filter(
      (filtrado) =>
        filtrado.involucrados === involucrados ||
        filtrado.involucrados === opcion2
    );
    return arreglo.slice(0, 10);
  }

  get usuariosConectados() {
    return Object.values(this.usuarios); //obtenemos un arreglo de objetos con los usuarios [{},{},{}]
  }

  usuariosLista(id) {
    const lista = this.usuariosConectados;

    return lista.filter((elemento) => elemento._id != id);
  }
  enviarMensaje(uid, nombre, mensaje, tipo, sala) {
    //para la sala global
    this.mensajes.push(new Mensaje(uid, nombre, mensaje, tipo, sala)); //al arreglo de mensajes le agregamos un objeto de tipo mensaje con sus parámetros
  }

  enviarMensajePrivado(uid, nombre, mensaje, involucrados) {
    //para la sala global
    this.mensajesPrivados.push(
      new MensajePrivado(uid, nombre, mensaje, involucrados)
    ); //al arreglo de mensajes le agregamos un objeto de tipo mensaje con sus parámetros
  }

  agregarUsuarios(usuario) {
    this.usuarios[usuario.id] = usuario; //agregamos el objeto usuarios
  }

  desconectarUsuario(id) {
    delete this.usuarios[id]; // borramos del arreglo de usuarios el que tenga este id
  }

  guardarBD() {
    /* if (tipo) {
      // es un mensaje privado

      fs.writeFileSync(
        this.path + involucrados + ".json",
        JSON.stringify(this.ultimos10Privados)
      );
    } else {*/
    if (this.ultimos10.length === 0) {
      return;
    }
    fs.writeFileSync(this.path + "global.json", JSON.stringify(this.ultimos10));
    //  }

    //fs.writeFileSync(this.path+"ejemplo", {encoding:"utf-8"});
  }

  guardarPrivadosBD(involucrados = "") {
    if (this.ultimos10Privados.length === 1) {
      return;
    }
    fs.writeFileSync(
      this.path + involucrados + ".json",
      JSON.stringify(this.ultimos10Privados)
    );
  }

  leerBD() {
    if (!fs.existsSync(this.path + "global.json")) {
      return;
    }
    const info = fs.readFileSync(this.path + "global.json", {
      encoding: "utf-8",
    });
    const data = JSON.parse(info);
    console.log(data);
    this.mensajes = data;
  }
}

module.exports = ChatMensajes;
