const { response } = require("express");
const path = require("path");
const fs = require("fs");
const { validarArchivos } = require("../helpers/subida-archivos");
const Producto = require("../models/productos");
const Users = require("../models/user");

const subirArchivo = async (req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    // si no hay files,  si no viene un file siquiera,
    res.status(400).json({ msg: "No hay archivos" });
    return;
  }

  if (!req.files.archivo) {
    //ttiene que venir el nombre del archivo del backend
    res.status(400).json({ msg: "No hay archivos" });
    return;
  }

  try {
    // const nombreGuardado = await validarArchivos(req.files); //guarda directo en la carpeta principal
    const nombreGuardado = await validarArchivos(
      req.files,
      undefined,
      "productos"
    );
    res.status(200).json({
      nombreGuardado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al subir",
    });
  }
};

const actualizarProfileProducto = async (req, res = response) => {
  //destructurar lo que viene en los parámetros
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "users":
      modelo = await Users.findById(id);

      if (!modelo) {
        res.status(400).json({ msg: "No existe el usuario" });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        res.status(400).json({ msg: "No existe el usuario" });
      }
      break;

    default:
      res.status(500).json({
        msg: "Error",
      });
      break;
  }

  if (req.files) {
    if (modelo.img) {
      const pathImagen = path.join(
        __dirname,
        "../uploads/",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }

    const nombreGuardado = await validarArchivos(
      req.files,
      undefined,
      coleccion
    );

    modelo.img = nombreGuardado;
    modelo.save();

    res.status(200).json({
      msg: "LLego",
      modelo,
    });
  } else {
    return res.status(400).json({
      msg: "No hay imagen que subir",
    });
  }
};

const obtenerImgen = async (req, res) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "users":
      modelo = await Users.findById(id);

      if (!modelo) {
        res.status(400).json({ msg: "No existe el usuario" });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        res.status(400).json({ msg: "No existe el usuario" });
      }
      break;

    default:
      res.status(500).json({
        msg: "Error",
      });
      break;
  }

  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      "../uploads/",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  } else {
    const pathVacio = path.join(
      __dirname,

      "../assets/no-image.jpg"
    );
    return res.sendFile(pathVacio);
  }
};

module.exports = {
  subirArchivo,
  actualizarProfileProducto,
  obtenerImgen,
};
