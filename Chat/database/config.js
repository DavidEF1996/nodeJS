const moongose = require("mongoose");

const dbConnection = async () => {
  try {
    await moongose.connect(process.env.CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Base conectada");
  } catch (error) {
    throw new Error("Error al iniciar la base de datos");
  }
};

module.exports = {
  dbConnection,
};
