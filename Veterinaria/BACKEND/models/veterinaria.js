const { Schema, model } = require("mongoose");

const VeterinariaSchema = {
  nombre: {
    type: String,
    trim: true,
    required: [true, "El nombre es obligatorio"], //especificamos que es de tipo string, que es obligatorio y en caso de no venir el nombre un mensaje de error
  },

  propietario: {
    type: String,
    trim: true,
    require: [true, "El propietario es obligatorio"],
  },

  fecha: {
    type: String,
    trim: true,
    require: [true, "La fecha es obligatoria"],
  },
  hora: {
    type: String,
    trim: true,
    require: [true, "La hora es obligatoria"],
  },
  telefono: {
    type: String,
    trim: true,
    require: [true, "El telefono es obligatorio"],
  },
  sintomas: {
    type: String,
    trim: true,
    require: [true, "Los síntomas son obligatorios"],
  },
};

module.exports = model("Paciente", VeterinariaSchema);
