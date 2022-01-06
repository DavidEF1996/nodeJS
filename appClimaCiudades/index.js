require("dotenv").config();
const {
  menuInteractivo,
  pausaIteractiva,
  escuchar,
  menuElegirLugar,
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
        //Ingresa la ciudad y devuelve un arreglo con los lugares que coinciden
        const ciudadUsuario = await escuchar("Ingrese la ciudad");
        const arregloLugares = await modeloCiudad.buscarCiudad(ciudadUsuario);

        //creamos el menú para elegir cual es el que deseamos
        const id = await menuElegirLugar(arregloLugares);
        const informacion = arregloLugares.find((l) => l.id === id);

        console.log("\nInformacion de la ciudad \n".green);
        console.log("Ciudad:", informacion.name);
        console.log("lat: ", informacion.lat);
        console.log("Lon: ", informacion.lon);
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
