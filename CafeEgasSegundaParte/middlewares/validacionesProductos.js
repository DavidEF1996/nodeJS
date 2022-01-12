const Categoria = require("../models/categorias");

const existeId = async (id) => {
  const idRecibido = await Categoria.findById(id);
  if (!idRecibido) {
    throw new Error("El usuario no existe");
  }
};

module.exports = {
  existeId,
};
