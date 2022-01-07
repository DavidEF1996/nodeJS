const express = require("express");
const hbs = require("hbs");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

//servidor de contenido estático
app.use(express.static("public"));

//Rutas renderizadas -----
app.get("/", (req, res) => {
  res.render("home", {
    nombre: "David",
    titulo: "Ingeniero de Sistemas",
    //desde aquí se pasan parámetros que son usados en las páginas web que esten en views para renderizar
  });
});

app.get("/generic", (req, res) => {
  res.render("generic", {
    nombre: "David",
    titulo: "Ingeniero de Sistemas",
    //desde aquí se pasan parámetros que son usados en las páginas web que esten en views para renderizar
  });
});
//----------

//Rutas sin renderizar
app.get("/elements", (req, res) => {
  res.sendFile(__dirname + "/public/elements.html");
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/404.html");
});

//puerto donde va a escuchar la app
app.listen(port);
