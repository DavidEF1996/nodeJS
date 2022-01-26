const fs = require("fs");
class Mensaje {
  constructor(uid, nombre, mensaje) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
  }
}

class ChatMensajes {
  path = "./database/";
  constructor() {
    this.mensajes = []; //este es un arreglo que contendrá los mensajes
    this.usuarios = {}; //todos los usuarios se guardaran como objetos
  }

  get ultimos10() {
    return this.mensajes.slice(0, 10);
  }

  get usuariosConectados() {
    return Object.values(this.usuarios); //obtenemos un arreglo de objetos con los usuarios [{},{},{}]
  }

  usuariosLista(id) {
    const lista = this.usuariosConectados;
    console.log(lista);
    return lista.filter((elemento) => elemento._id !== id);
  }
  enviarMensaje(uid, nombre, mensaje) {
    //para la sala global
    this.mensajes.unshift(new Mensaje(uid, nombre, mensaje)); //al arreglo de mensajes le agregamos un objeto de tipo mensaje con sus parámetros
  }

  agregarUsuarios(usuario) {
    this.usuarios[usuario.id] = usuario; //agregamos el objeto usuarios
  }

  desconectarUsuario(id) {
    delete this.usuarios[id]; // borramos del arreglo de usuarios el que tenga este id
  }

  guardarBD() {
    console.log("llego");
    const enviar = {
      nombre: "David",
    };
    fs.writeFileSync(this.path + "ejemplo.json", JSON.stringify(enviar));
    //fs.writeFileSync(this.path+"ejemplo", {encoding:"utf-8"});
  }
}

module.exports = ChatMensajes;
