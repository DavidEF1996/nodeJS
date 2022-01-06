const { tablas } = require("./helpers/multiplicar");
const argv = require("./config/yargs");
console.clear();

let numero = argv.b;
let estado = argv.l;
let limite = argv.h;

tablas(numero, estado, limite)
  .then((respuesta) => console.log(respuesta))
  .catch((err) => console.log(err));
