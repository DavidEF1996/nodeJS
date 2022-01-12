const jwt = require("jsonwebtoken");

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

module.exports = {
  generarToken,
};
