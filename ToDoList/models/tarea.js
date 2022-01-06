const { v4: uuid4 } = require("uuid");

class Tarea {
  id = "";
  descripcion = "";
  completado = null;

  constructor(descripcion) {
    this.id = uuid4();
    this.descripcion = descripcion;
    this.completado = null;
  }
}
module.exports = Tarea;
