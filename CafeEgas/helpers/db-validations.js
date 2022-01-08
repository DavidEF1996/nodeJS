const Role = require("../models/role");
const User = require("../models/user");

const exisRol = async (rol = "") => {
  const recibirRol = await Role.findOne({ rol });
  if (!recibirRol) {
    throw new Error("El rol no existe");
  }
};

const existEmail = async (correo = "") => {
  const emailRecibido = await User.findOne({ correo });
  if (emailRecibido) {
    throw new Error("El correo ya existe");
  }
};

module.exports = {
  exisRol,
  existEmail,
};
