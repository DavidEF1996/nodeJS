require("dotenv").config(); //paquete importante para escuchar en el puerto indicado con la variable de entorno programada
const cors = require("cors"); //improtacion de cors
const express = require("express");
const { dbConnection } = require("../database/config");

class Veterinaria {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.vetRoute = "/api/veterinaria";
    this.conectarBD();
    this.middlewares();
    this.routes();
  }

  async conectarBD() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor Corriendo");
    });
  }

  routes() {
    this.app.use(this.vetRoute, require("../routes/userRoutes"));
  }
}

module.exports = Veterinaria;
