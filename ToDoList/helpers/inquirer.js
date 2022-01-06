const inquirer = require("inquirer");
const { validate } = require("uuid");

const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [
      {
        value: "1",
        name: "1. Crear Tarea",
      },
      {
        value: "2",
        name: "2. Listar Tareas",
      },
      {
        value: "3",
        name: "3. Listar Tareas Completadas",
      },
      {
        value: "4",
        name: "4. Listar Tareas Pendientes",
      },
      {
        value: "5",
        name: "5. Completar Tarea(s)",
      },
      {
        value: "6",
        name: "6. Borrar Tarea",
      },
      {
        value: "0",
        name: "0. Salir",
      },
    ],
  },
];

async function menuInteractivo() {
  //console.clear();
  console.log("========================".green);
  console.log("     Elija una opción:".green);
  console.log("========================\n".green);

  const { opcion } = await inquirer.prompt(preguntas);

  return opcion;
}

async function pausaIteractiva() {
  console.log("\n");
  const opcon = await inquirer.prompt([
    {
      type: "input",
      name: "enter",
      message: "Presione Enter para continuar...",
    },
  ]);

  return opcon;
}

async function escuchar(message) {
  const pregunta = [
    {
      type: "input",
      name: "descr",
      message,
      validate(value) {
        if (value.length === 0) {
          return "No puede ir vacío";
        }
        return true;
      },
    },
  ];

  const { descr } = await inquirer.prompt(pregunta);
  return descr;
}

module.exports = {
  menuInteractivo,
  pausaIteractiva,
  escuchar,
};
