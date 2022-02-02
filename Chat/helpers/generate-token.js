const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generarToken = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.secretOrPrivateKey,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const comprobarJWTSocket = async (token = "") => {
  try {
    if (token.length < 10) {
      return null;
    }

    const { uid } = jwt.verify(token, process.env.secretOrPrivateKey);
    const usuario = await User.findById(uid);

    if (usuario) {
      if (usuario.estado) {
        return usuario;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const buscarUsuarioPorCorreo = async (correo = "") => {
  const usuario = await User.findOne({ correo });
  if (usuario) {
    return usuario;
  } else {
    return null;
  }
};

const buscarUsuarioPorId = async (uid = "") => {
  const usuario = await User.findById(uid);
  if (usuario) {
    return usuario;
  } else {
    return null;
  }
};

module.exports = {
  generarToken,
  comprobarJWTSocket,
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
};
