const { Schema, model } = require("mongoose");

//Esta tabla es para recibir los roles de la base y comparar con los que vienen de los usuarios
const RoleSchema = Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
});

module.exports = model("Role", RoleSchema);
