const { response } = require("express");
const Producto = require("../models/productos");

async function crearProducto(req, res = response) {
  const { nombre, estado, usuario, ...body } = req.body;
  let nombreEnviar = nombre.toUpperCase();

  const productoBd = await Producto.findOne({ nombre: nombreEnviar }); //buscamos si existe esta producto en la base
  console.log(productoBd);
  if (productoBd) {
    res.status(400).json({
      msg: "El producto ya existe",
    });
  }

  //Datos enviar
  const datosEnviar = {
    ...body,
    nombre: nombreEnviar,
    usuario: req.usuario._id,
  };
  console.log(datosEnviar);

  //construimos el modelo
  const producto = new Producto(datosEnviar);

  //enviamos el modelo a la base
  await producto.save();
  res.status(201).json({
    msg: "El producto se inserto correctamente",
    producto,
  });
}

async function actualizarProducto(req, res = response) {
  const { id } = req.params;

  const { _id, usuario, ...resto } = req.body;

  if (resto.nombre) {
    resto.nombre = resto.nombre.toUpperCase();
  }

  resto.usuario = req.usuario._id;
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(id, resto);
    res.status(200).json({
      msg: "Se actualizo correctamente",
      productoActualizado,
    });
  } catch (error) {
    res.status(400).json({
      msg: "No se pudo actualizar",
    });
  }
}

async function listarProductos(req, res = response) {
  const listaProductos = await Producto.find({ estado: true });
  res.status(200).json({
    msg: "La lista de productos es",
    listaProductos,
  });
}

async function listarProducto(req, res = response) {
  const { id } = req.params;

  const producto = await Producto.findById(id);
  const { disponible, estado } = producto;
  console.log(disponible);

  if (disponible && estado) {
    res.status(200).json({
      msg: "El producto es: ",

      producto,
    });
  } else if (estado && !disponible) {
    res.status(200).json({
      msg: "El producto es: ",
      estado: "El producto no tiene stock",
      producto,
    });
  } else {
    res.status(200).json({
      msg: "El producto es: ",
      estado: "El producto esta Eliminado",
      producto,
    });
  }
}

async function eliminarProducto(req, res = response) {
  const { id } = req.params;

  try {
    const productoEliminado = await Producto.findByIdAndUpdate(id, {
      estado: false,
      disponible: false,
    }).populate("usuario", "nombre");

    res.status(200).json({
      msg: "Producto Elimiando",
      productoEliminado,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Error al eliminar",
    });
  }
}

module.exports = {
  crearProducto,
  actualizarProducto,
  listarProductos,
  listarProducto,
  eliminarProducto,
};
