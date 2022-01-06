const { mostrarMenu, pausa } = require("./helpers/mensajes");

require("colors");
console.clear();
let opt = "";

iniciar();
async function iniciar() {
  do {
    opt = await mostrarMenu();
    if (opt !== "0") await pausa();
  } while (opt !== "0");
}
