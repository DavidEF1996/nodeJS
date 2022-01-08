const { response } = require("express");
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
  const body = req.body; // recibimos los datos en formato json
  const user = new User(body); //pasamos los datos al esquema
  await user.save(); //guardamos en la base de datos
  const { name } = req.body;
  res.status(200).json({
    msg: "post controller",
    name,
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
