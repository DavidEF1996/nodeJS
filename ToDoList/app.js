const { menuInteractivo, pausaIteractiva } = require("./helpers/inquirer");
const { mostrarMenu, pausa } = require("./helpers/mensajes");

require("colors");
console.clear();
let opt = "";

iniciar();
async function iniciar() {
  do {
    if (opt !== "0") await pausaIteractiva();
    console.log({ opt });
    opt = await menuInteractivo();
  } while (opt !== "0");
}
