const { guardar, leer } = require("./helpers/guardarArchivo");
const {
  menuInteractivo,
  pausaIteractiva,
  escuchar,
  menuEliminar,
  confirmarEliminacion,
  menuActualizar,
} = require("./helpers/inquirer");
const { mostrarMenu, pausa } = require("./helpers/mensajes");
const Tarea = require("./models/tarea");
const Tareas = require("./models/tareas");

require("colors");
console.clear();
let opt = "";

iniciar();
async function iniciar() {
  const tareas = new Tareas();
  const tareasDb = leer();
  if (tareasDb) {
    tareas.leerDesdeBase(tareasDb);
  }

  do {
    opt = await menuInteractivo();

    switch (opt) {
      case "1":
        const recibir = await escuchar("Descripcion: ");
        tareas.crear(recibir);
        break;
      case "2":
        tareas.listarTodo();
        break;

      case "3":
        tareas.listarPendientesCompletadas(true);
        break;

      case "4":
        tareas.listarPendientesCompletadas(false);
        break;
      case "5":
        const ids = await menuActualizar(tareas.listado);
        tareas.actualizarTareas(ids);
        break;

      case "6":
        const id = await menuEliminar(tareas.listado);
        if (id !== "0") {
          const confirmar = await confirmarEliminacion(
            "¿Está seguro de eliminar?"
          );
          if (confirmar) {
            tareas.eliminarTarea(id);
            console.log("Tarea borrada");
          } else {
            console.log("No se realizaron cambios");
          }
        }
        break;
    }
    guardar(tareas.listado);
    await pausaIteractiva();
  } while (opt !== "0");

  /**
   * Para fines demostrativos
   *   const tarea = new Tarea();
  tarea.descripcion = "dd";
  tarea.completado = true;
  const tareas = new Tareas();
  tareas._listado[tarea.id] = tarea; //Esto crea en el listado una llave con el id y su valor que es el objeto tarea
   */

  console.log(tareas);
}
