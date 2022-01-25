require("dotenv").config(); //paquete para las variables globales
const Server = require("./models/server"); //recibimos la clase exportada

const server = new Server(); //creamos una instancia
server.listen(); //iniciamos la escucha del puerto
