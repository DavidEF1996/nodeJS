const express = require("express"); //importacion de express
const cors = require("cors"); //improtacion de cors
const mongoose = require("mongoose"); //importamos moongose como base de datos
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");

class Server {
  //clase que iniciara un servidor

  constructor() {
    this.app = express(); // iniciamos express en esta variable
    this.port = process.env.PORT; // especificamos el puerto global de .env

    this.rutas = {
      usuarios: "/api/users",
      autenticacion: "/api/auth",
      categorias: "/api/categorias",
      productos: "/api/productos",
      busquedas: "/api/buscar",
      uploads: "/api/subirArchivos",
    };

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

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true, // esto es para poder crear subdirectorios
      })
    );
  }

  routes() {
    //tenemos una ruta de ejemplo por defecto con este path
    //this.app.get("/hola", (req, res) => {
    //res.send("hola get");
    //});

    this.app.use(this.rutas.usuarios, require("../routes/users")); //Este es un middleware que identifica las solicitudes por esta ruta
    this.app.use(this.rutas.autenticacion, require("../routes/auth"));
    this.app.use(this.rutas.categorias, require("../routes/products")); //el modelo es products sin embargo debería ser categorias
    this.app.use(this.rutas.productos, require("../routes/productos"));
    this.app.use(this.rutas.busquedas, require("../routes/busquedas"));
    this.app.use(this.rutas.uploads, require("../routes/upload"));
  }

  listen() {
    //inicia la app en el puerto especificado
    this.app.listen(this.port);
  }
}

//exportamos la clase para que pueda ser usada en cualquier otro js
module.exports = Server;
