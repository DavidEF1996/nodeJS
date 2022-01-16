const { Schema, model } = require("mongoose");

//Esta tabla es para recibir los roles de la base y comparar con los que vienen de los usuarios
const ProductoSchema = Schema({
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
  precio: {
    type: Number,
    default: 0,
  },

  categoria: {
    type: Schema.Types.ObjectId,
    href: "Categoria",
    required: true,
  },
  descripcion: {
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },

  img: {
    type: String,
  },
});

ProductoSchema.methods.toJSON = function () {
  const { __v, estado, ...categoria } = this.toObject();

  return categoria;
};

module.exports = model("Producto", ProductoSchema);
