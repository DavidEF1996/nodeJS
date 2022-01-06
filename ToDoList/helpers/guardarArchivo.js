const fs = require("fs");

const archivo = "./db/archivo.json";

function guardar(data) {
  fs.writeFileSync(archivo, JSON.stringify(data));
}

function leer() {
  if (!fs.existsSync(archivo)) {
    return null;
  }
  const info = fs.readFileSync(archivo, { encoding: "utf-8" });
  const enviar = JSON.parse(info);

  return enviar;
}

module.exports = {
  guardar,
  leer,
};
