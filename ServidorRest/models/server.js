const express = require("express"); //importacion de express

class Server {
  //clase que iniciara un servidor

  constructor() {
    this.app = express(); // iniciamos express en esta variable
    this.port = process.env.PORT; // especificamos el puerto global de .env

    //llamamos los middleware que estemos usando
    this.middlewares();

    //llamamos las rutas al iniciar una instancia
    this.routes();
  }

  middlewares() {
    //especificamos la ruta por defecto http......localhost:8080 va a apuntar a la página index de la carpeta pública
    this.app.use(express.static("public"));
  }

  routes() {
    //tenemos una ruta de ejemplo por defecto con este path
    this.app.get("/hola", (req, res) => {
      res.send("hola mundo");
    });
  }

  listen() {
    //inicia la app en el puerto especificado
    this.app.listen(this.port);
  }
}

//exportamos la clase para que pueda ser usada en cualquier otro js
module.exports = Server;
