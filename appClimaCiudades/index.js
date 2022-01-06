const {
  menuInteractivo,
  pausaIteractiva,
  escuchar,
} = require("./helpers/inquirer");
const ModeloCiudad = require("./models/busquedas");
require("colors");
main();
let opcion;
async function main() {
  const modeloCiudad = new ModeloCiudad();
  do {
    opcion = await menuInteractivo();
    console.log(opcion);

    switch (opcion) {
      case 1:
        const ciudadUsuario = await escuchar("Ingrese la ciudad");
        console.log(ciudadUsuario);

        console.log("\nInformacion de la ciudad \n".green);
        console.log("Ciudad:");
        console.log("lat: ");
        console.log("Lon: ");
        console.log("Temperatura: ");
        console.log("Mínima: ");
        console.log("Máxima: ");

        break;

      case 2:
        break;

      default:
        break;
    }
    if (opcion !== 0) await pausaIteractiva();
  } while (opcion != 0);
}
