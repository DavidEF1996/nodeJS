const { response } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const getUsers = async (req, res = response) => {
  //hicimos el res = response para poder tener las ayudas de vs sobre json, status, etc

  const usuarios = await User.find({ estado: true });
  const totalRegistros = await User.countDocuments({ estado: true });
  res.status(200).json({
    msg: "Lista de Usuariosr",
    totalRegistros: totalRegistros,
    usuarios,
  });
};
const getUsersWithParams = async (req, res = response) => {
  //hicimos el res = response para poder tener las ayudas de vs sobre json, status, etc
  const { limit = 5, desde = 0 } = req.query; //son las restriccciones de la consulta
  //------------------------------------------
  /*
  const usuarios = await User.find({ estado: true })
    .skip(Number(desde))
    .limit(Number(limit)); //se pone estado = true para que solo traiga los usuarios activos y no los eliminados
  const totalUsuarios = await User.countDocuments({ estado: true });*/
  //FORMA POCO OPTIMA
  //---------------------------

  const [totalUsuarios, usuarios] = await Promise.all([
    User.countDocuments({ estado: true }),
    User.find({ estado: true }).skip(Number(desde)).limit(Number(limit)),
  ]);

  res.status(200).json({
    msg: "Lista parametrizada",
    totalRegistros: totalUsuarios,
    usuarios,
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

async function deleteUsers(req, res = response) {
  const { id } = req.params;
  const usuario = await User.findByIdAndUpdate(id, { estado: false }); //Buscamos el usuario con ese id y actualizamos el estado para que no aparezca en los select
  res.status(200).json({
    msg: "Usuario Eliminado",
    usuario,
  });
}

async function putUsers(req, res = response) {
  const { id } = req.params;
  const { password, google, correo, ...resto } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuarioActualizado = await User.findByIdAndUpdate(id, resto);

  console.log(resto);
  res.status(200).json({
    msg: "Usuario Actualizado",
    usuarioActualizado,
  });
}

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
  getUsersWithParams,
};
