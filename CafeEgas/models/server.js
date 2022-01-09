const express = require("express"); //importacion de express
const cors = require("cors"); //improtacion de cors
const mongoose = require("mongoose"); //importamos moongose como base de datos
const { dbConnection } = require("../database/config");

class Server {
  //clase que iniciara un servidor

  constructor() {
    this.app = express(); // iniciamos express en esta variable
    this.port = process.env.PORT; // especificamos el puerto global de .env
    this.usersRoute = "/api/users";
    this.authPath = "/api/auth"; //es la ruta para la autenticacion

    //Llamamos a la base al inicair esta instancia
    this.conectarBD();

    //llamamos los middleware que estemos usando
    this.middlewares();

    //llamamos las rutas al iniciar una instancia
    this.routes();
  }

  async conectarBD() {
    await dbConnection();
  }

  middlewares() {
    //Cors
    this.app.use(cors());

    //middleware para usar json de las peticiones post put, etc
    this.app.use(express.json());

    //especificamos la ruta por defecto http......localhost:8080 va a apuntar a la página index de la carpeta pública
    this.app.use(express.static("public"));
  }

  routes() {
    //tenemos una ruta de ejemplo por defecto con este path
    //this.app.get("/hola", (req, res) => {
    //res.send("hola get");
    //});

    this.app.use(this.usersRoute, require("../routes/users")); //Este es un middleware que identifica las solicitudes por esta ruta
    this.app.use(this.authPath, require("../routes/auth"));
  }

  listen() {
    //inicia la app en el puerto especificado
    this.app.listen(this.port);
  }
}

//exportamos la clase para que pueda ser usada en cualquier otro js
module.exports = Server;
