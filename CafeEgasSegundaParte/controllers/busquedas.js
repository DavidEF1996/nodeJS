const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const Usuario = require("../models/user");
const Producto = require("../models/productos");
const Categoria = require("../models/categorias");

const colecciones = ["categorias", "productos", "roles", "users"];

async function consultar(termino = "", res = response, coleccion) {
  console.log(termino);
  const esMongoId = ObjectId.isValid(termino); //usamos esta funcion para saber si es un mongo id válido

  if (esMongoId) {
    const usuario = await coleccion.findById(termino);
    res.status(200).json({
      results: usuario ? [usuario] : [],
    });
  }

  let reges = new RegExp(termino, "i"); //buscamos el termino con expresion regular y la i para que no sea sensible a mayúsculas y minúsculas
  const recibirBusqueda = await coleccion.find({
    $or: [{ nombre: reges }, { correo: reges }],
    $and: [{ estado: true }],
  }); //si no fue un id válido pasa a esta búsqueda, donde no buscamos por id sino por el nombre o correo

  res.status(200).json({
    results: recibirBusqueda ? [recibirBusqueda] : [],
  });
}

async function buscar(req, res = response) {
  const { coleccion, termino } = req.params;

  if (!colecciones.includes(coleccion)) {
    res.status(500).json({
      msg: "La coleccion no existe",
    });
  }
  let opcion;
  switch (coleccion) {
    case "users":
      opcion = Usuario;
      consultar(termino, res, opcion);
      break;

    case "productos":
      opcion = Producto;
      consultar(termino, res, opcion);
      break;

    case "categorias":
      opcion = Categoria;
      consultar(termino, res, opcion);
      break;

    default:
      break;
  }
}

module.exports = {
  buscar,
};
