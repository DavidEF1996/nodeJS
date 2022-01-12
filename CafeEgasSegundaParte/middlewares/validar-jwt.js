const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Categoria = require("../models/categorias");
const Producto = require("../models/productos");

const validarToken = async (req = request, res = response, next) => {
  const token = req.header("x-token"); //recibimos el token mandado en los headers de postman

  if (!token) {
    return res.status(401).json({
      msg: "El token es obligatorio",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.secretOrPrivateKey);
    //enviamos por el req los datos del usuario logueado
    const usuario = await User.findOne({ uid });

    if (!usuario) {
      return res.status(401).json({
        msg: "Usuario no existe",
      });
    }

    //validar si el usuario logueado no esta eliminado
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "El usuario tiene un token no válido ",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Error al autenticar token",
    });
  }
};

async function existeCategoria(id) {
  const recibirCat = await Categoria.findById(id);
  if (!recibirCat) {
    throw new Error("La categoria no existe");
  }
}

async function existeProducto(id) {
  const recibirCat = await Producto.findById(id);

  if (!recibirCat) {
    throw new Error("El producto no existe");
  }
}

module.exports = {
  validarToken,
  existeCategoria,
  existeProducto,
};
