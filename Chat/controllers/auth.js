const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { googleVerify } = require("../helpers/generate-google-token");
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

const google = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img, apellido } = await googleVerify(id_token);

    //buscamos si el usuario existe en la bd
    let usuarioBd = await User.findOne({ correo });

    if (!usuarioBd) {
      //si no existe lo creamos
      const dataNueva = {
        nombre,
        apellido,
        correo,
        password: ":p",
        img,
        rol: "USER_ROLE",
        google: "true",
      };

      usuarioBd = new User(dataNueva);
      await usuarioBd.save(); //mandamos a guardar usuario
    }

    if (!usuarioBd.estado) {
      //si el usuario esta elimiando mandamos la captura del error
      return res.status(401).json({
        msg: "No existe usuario, comuniquese con el administrador",
      });
    }

    //generar el token
    const toke = await generarToken(usuarioBd.id); //generamos el token pasando el id de mongo

    res.status(200).json({
      ok: false,
      toke,
      usuarioBd,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Error en la autenticación",
    });
  }
};

const renovarToken = async (req, res = response) => {
  const { usuario } = req;

  const token = await generarToken(usuario.id);

  res.status(200).json({
    usuario,
    token,
  });
};

module.exports = {
  login,
  google,
  renovarToken,
};
