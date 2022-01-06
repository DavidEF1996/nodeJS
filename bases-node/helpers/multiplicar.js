const fs = require("fs");

async function tablas(numero, estado, limite) {
  let salida = "";
  for (let index = 1; index <= limite; index++) {
    salida += numero + " x " + index + " = " + numero * index + "\n";
  }
  if (estado) {
    console.log(salida);
  }

  try {
    fs.writeFileSync("tabla-5.txt", salida);
  } catch (error) {
    throw error;
  }

  return "Creado correctamente";
}

module.exports = {
  tablas,
};
