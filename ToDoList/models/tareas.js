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

  listarTodo() {
    console.log();
    this.listado.forEach((element, index) => {
      const idx = `${index + 1}`.green;
      const { descripcion, completado } = element;
      const estado = completado ? "Completado".green : "Pendiente".red;
      console.log(`${idx} ${descripcion} :: ${estado}`);
    });
  }

  listarPendientesCompletadas(completadas = false) {
    if (completadas) {
      const complete = this.listado.filter((item) => item.completado != null);

      complete.forEach((element, index) => {
        const idx = `${index + 1}`.green;
        const { descripcion, completado } = element;
        const estado = completado ? "Completado".green : "Pendiente".red;
        console.log(`${idx} ${descripcion} :: ${estado}`);
      });
    } else {
      const complete = this.listado.filter((item) => item.completado === null);

      complete.forEach((element, index) => {
        const idx = `${index + 1}`.green;
        const { descripcion, completado } = element;
        const estado = completado ? "Completado".green : "Pendiente".red;
        console.log(`${idx} ${descripcion} :: ${estado}`);
      });
    }
  }

  eliminarTarea(id) {
    if (this._listado[id]) {
      delete this._listado[id];
    }
  }

  actualizarTareas(ids = []) {
    ids.forEach((element) => {
      const tarea = this._listado[element];
      if (!tarea.completado) {
        console.log("entro");
        tarea.completado = new Date().toISOString();
      }
    });

    this.listado.forEach((element) => {
      if (!ids.includes(element.id)) {
        this._listado[element.id].completado = null;
      }
    });
  }
}

module.exports = Tareas;
