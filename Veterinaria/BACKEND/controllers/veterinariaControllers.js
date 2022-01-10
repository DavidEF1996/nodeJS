const { response } = require("express");
const Veterinaria = require("../models/veterinaria");

async function insertarUsuarios(req, res = response) {
  const { nombre, propietario, fecha, hora, sintomas } = req.body; // recibimos los datos en formato json
  const paciente = new Veterinaria({
    nombre,
    propietario,
    fecha,
    hora,
    sintomas,
  }); //pasamos los datos al esquema

  await paciente.save(); //guardamos en la base de datos

  res.json({
    msg: "Insertado correctamente",
    paciente,
  });
}

async function devolverPacientes(req, res = response) {
  const pacientes = await Veterinaria.find({});

  return res.status(200).json({
    msg: "Los pacientes son:",
    pacientes,
  });
}

async function devolverPaciente(req, res = response) {
  const paciente = await Veterinaria.findById(req.params.id);

  return res.status(200).json({
    msg: "El paciente es:",
    paciente,
  });
}

async function actualizar(req, res = response) {
  const { id } = req.params;
  console.log("El id es:", id);
  const pacienteActualizado = await Veterinaria.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    }
  );

  return res.status(200).json({
    msg: "Se actualizo correctamente",
    pacienteActualizado,
  });
}

async function eliminar(req, res = response) {
  const { id } = req.params;
  const pacienteEliminado = await Veterinaria.findOneAndDelete({ _id: id });
  res.status(200).json({
    msg: "El usuario fue eliminado",
    pacienteEliminado,
  });
}

module.exports = {
  insertarUsuarios,
  devolverPacientes,
  devolverPaciente,
  actualizar,
  eliminar,
};
