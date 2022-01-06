require("colors");

function mostrarMenu() {
  return new Promise((resolve) => {
    console.clear();
    console.log("========================".green);
    console.log("     Elija una opción:".green);
    console.log("========================\n".green);

    console.log(`${"1.".green} Crear Tarea`);
    console.log(`${"2.".green}  Listar Tareas`);
    console.log(`${"3.".green}  Listar Tareas Completadas`);
    console.log(`${"4.".green}  Listar Tareas Pendientes`);
    console.log(`${"5.".green}  Completar tarea(s)`);
    console.log(`${"6.".green}  Borrar Tareas`);
    console.log(`${"0.".green}  Salir \n`);

    const readline = require("readline").createInterface({
      //Esto crea la interfaz de usuario
      input: process.stdin, //pide datos
      output: process.stdout, //mensaje al usuario
    });

    readline.question("Seleccione una opción: ", (opt) => {
      resolve(opt);
      readline.close();
    });
  });
}

const pausa = () => {
  return new Promise((resolve) => {
    const readline = require("readline").createInterface({
      //Esto crea la interfaz de usuario
      input: process.stdin, //pide datos
      output: process.stdout, //mensaje al usuario
    });

    readline.question("Precione enter para continuar: \n", (opt) => {
      resolve();
      readline.close();
    });
  });
};

//Usualmente se exporta como objeto cuando hay más funciones para seguir agregando
module.exports = {
  mostrarMenu,
  pausa,
};
