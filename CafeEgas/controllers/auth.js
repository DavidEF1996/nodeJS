const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarToken } = require("../helpers/generate-token");
const User = require("../models/user");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //buscamos el usuario con el correo
    const usuario = await User.findOne({ correo });

    //si no existe se termina
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario no existe",
      });
    }
    //si esta eliminado se termina
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario no existe",
      });
    }

    //comparamos la contraseña
    const validarPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "Contraseña no válida",
      });
    }

    //generar el token
    const toke = await generarToken(usuario.id);

    //Si no cayó en alguna de las validaciones anteriores, devuelve un 200 y la info del usuario
    return res.status(200).json({
      msg: "Usuario logueado",
      usuario,
      toke, //devuelve el token
    });
  } catch (error) {
    return res.json({
      msg: "Algo salió mal",
    });
  }
};

module.exports = {
  login,
};
