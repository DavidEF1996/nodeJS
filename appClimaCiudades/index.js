require("dotenv").config();
const {
  menuInteractivo,
  pausaIteractiva,
  escuchar,
  menuElegirLugar,
} = require("./helpers/inquirer");
const ModeloCiudad = require("./models/busquedas");
require("colors");
console.clear();
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

        if (id === "0") continue;

        const informacion = arregloLugares.find((l) => l.id === id);

        //grabar bd
        modeloCiudad.agregarHistorial(informacion);

        modeloCiudad.lat = informacion.lat;
        modeloCiudad.lon = informacion.lon;
        const parametrosClima = await modeloCiudad.climaCiudad(
          informacion.lat,
          informacion.lon
        );

        console.log("\nInformacion de la ciudad \n".green);
        console.log("Ciudad:", informacion.name);
        console.log("lat: ", informacion.lat);
        console.log("Lon: ", informacion.lon);
        console.log("Temperatura: ", parametrosClima.temp);
        console.log("Mínima: ", parametrosClima.min);
        console.log("Máxima: ", parametrosClima.max);
        console.log("Como esta el clima: ", parametrosClima.desc);

        break;

      case 2:
        modeloCiudad.break;

      default:
        modeloCiudad.leerBd();
        modeloCiudad.historial.forEach((linea) => {
          console.log(linea.name);
        });
        break;
    }
    if (opcion !== 0) await pausaIteractiva();
  } while (opcion != 0);
}
