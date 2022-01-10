const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLECLIENT);
async function googleVerify(token = "") {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLECLIENT, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const { name, picture, email } = ticket.getPayload();
  const arregloNombres = name.split(" ");
  console.log(arregloNombres[0]);

  return {
    nombre: arregloNombres[0],
    apellido: arregloNombres[1],
    img: picture,
    correo: email,
  };
}

module.exports = {
  googleVerify,
};
