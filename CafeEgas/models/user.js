const { Schema, model } = require("mongoose");
const { use } = require("../routes/users");

const UserSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"], //especificamos que es de tipo string, que es obligatorio y en caso de no venir el nombre un mensaje de error
  },
  apellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
  },

  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true, //esto para que solo sea un correo
  },

  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true, // porque cuando yo cree un usuario este estará activado
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

module.exports = model("User", UserSchema);
