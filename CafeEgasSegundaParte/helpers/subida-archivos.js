const res = require("express/lib/response");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const validarArchivos = (
  files,
  extensiones = ["jpg", "png", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const aux = archivo.name.split(".");
    const auxEnviar = aux[aux.length - 1];
    console.log(auxEnviar);

    if (!extensiones.includes(auxEnviar)) {
      reject("La extensión no es válida");
    }

    const nombreTemporal = uuidv4() + "." + auxEnviar;
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      carpeta,
      nombreTemporal
    );

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemporal);
    });
  });
};

const colecccionesPermitidas = (coleccion = "", colecciones = []) => {
  const recibir = colecciones.includes(coleccion); // si le incluye por defecto existe entonces..
  if (!recibir) {
    throw new Error("La colección no es permitida");
  }
  return true;
};

module.exports = {
  validarArchivos,
  colecccionesPermitidas,
};
