const argv = require("yargs")
  .option("b", {
    alias: "base",
    type: "number",
    demandOption: true, //le obliga a mandarme el dato
    describe: "Es la base de la tabla",
  })
  .option("l", {
    alias: "list",
    type: "boolean",
    default: false,
    describe: "Muestra tabla en consola cuando esta presente",
  })
  .option("h", {
    alias: "limit",
    type: "number",
    demandOption: true,
    describe: "Muestra el límite de la tabla",
  })
  .check((argv, options) => {
    if (isNaN(argv.b)) {
      throw "La base debe ser un númer";
      //En este apartado recibimos en argv los parametros desde consola
      //y comprobamos que sea un número.
    }
    return true;
  }).argv;

module.exports = argv;
