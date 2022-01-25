const { response, request } = require("express");
const jwt = require("jsonwebtoken");

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
    const User = require("../models/user");
    const usuario = await User.findById(uid);

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
    console.log(error);
    return res.status(401).json({
      msg: "Error al autenticar token",
    });
  }
};

module.exports = {
  validarToken,
};
