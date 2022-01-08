const { response } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const getUsers = (req, res = response) => {
  //hicimos el res = response para poder tener las ayudas de vs sobre json, status, etc
  res.status(200).json({
    msg: "get controller",
  });
};
const getUsersWithParams = (req, res = response) => {
  //hicimos el res = response para poder tener las ayudas de vs sobre json, status, etc
  const { nombre = "NA", apellido = "NA" } = req.query;
  res.status(200).json({
    msg: "get controller",
    nombre,
    apellido,
  });
};

async function postUsers(req, res = response) {
  const { nombre, apellido, correo, password, rol } = req.body; // recibimos los datos en formato json
  const user = new User({ nombre, apellido, correo, password, rol }); //pasamos los datos al esquema

  //Encriptar contraseña
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);

  await user.save(); //guardamos en la base de datos

  res.json({
    msg: "Insertado correctamente",
    user,
  });
}

function deleteUsers(req, res = response) {
  res.status(200).json({
    msg: "delete controller",
  });
}

function putUsers(req, res = response) {
  const id = req.params.id;
  res.status(200).json({
    msg: "put controller",
    id,
  });
}

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
  getUsersWithParams,
};
