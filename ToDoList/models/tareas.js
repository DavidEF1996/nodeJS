const Tarea = require("./tarea");

class Tareas {
  _listado = {};

  get listado() {
    const arreglo = [];
    Object.keys(this._listado).forEach((element) => {
      const tarea = this._listado[element];
      arreglo.push(tarea);
    });

    return arreglo;
  }

  constructor() {
    this._listado = {};
  }

  leerDesdeBase(data = []) {
    data.forEach((element) => {
      this._listado[element.id] = element;
    });
  }

  crear(desc = "") {
    const tarea = new Tarea(desc);

    this._listado[tarea.id] = tarea;
  }
}

module.exports = Tareas;
