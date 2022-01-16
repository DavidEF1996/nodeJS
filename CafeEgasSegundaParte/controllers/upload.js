const { validarArchivos } = require("../helpers/subida-archivos");

const subirArchivo = async (req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    // si no hay files,  si no viene un file siquiera,
    res.status(400).json({ msg: "No hay archivos" });
    return;
  }

  if (!req.files.archivo) {
    //ttiene que venir el nombre del archivo del backend
    res.status(400).json({ msg: "No hay archivos" });
    return;
  }

  try {
    // const nombreGuardado = await validarArchivos(req.files); //guarda directo en la carpeta principal
    const nombreGuardado = await validarArchivos(
      req.files,
      undefined,
      "productos"
    );
    res.status(200).json({
      nombreGuardado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al subir",
    });
  }
};

module.exports = {
  subirArchivo,
};
