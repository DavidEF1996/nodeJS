const { Schema, model } = require("mongoose");

//Esta tabla es para recibir los roles de la base y comparar con los que vienen de los usuarios
const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

CategoriaSchema.methods.toJSON = function () {
  const { __v, estado, ...categoria } = this.toObject();

  return categoria;
};

module.exports = model("Categoria", CategoriaSchema);
