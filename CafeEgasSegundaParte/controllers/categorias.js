const { response } = require("express");
const Categoria = require("../models/categorias");

async function crearCategoria(req, res = response) {
  console.log(req.user);
  const nombre = req.body.nombre.toUpperCase(); // sacamos el nombre para guardarlo en mayúsculas

  const categoriaBD = await Categoria.findOne({ nombre }); //buscamos si existe esta categoría en la base

  if (categoriaBD) {
    res.status(400).json({
      msg: "La categoría ya existe",
    });
  }

  //Datos enviar
  const datosEnviar = {
    nombre,
    usuario: req.usuario._id, // id del token del usuario actual
  };

  //construimos el modelo
  const categoria = new Categoria(datosEnviar);

  //enviamos el modelo a la base
  await categoria.save();
  res.status(201).json({
    msg: "La categoria se inserto correctamente",
    categoria,
  });
}

async function obtenerCategorias(req, res = response) {
  const { limit = 5, desde = 0 } = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    msg: "Las categorias son",
    totalRegistros: total,
    categorias,
  });
}

async function obtenerCategoria(req, res = response) {
  const { id } = req.params;

  const categoria = await Categoria.findOne({ id }).populate(
    "usuario",
    "nombre"
  );

  if (categoria.estado) {
    res.status(200).json({
      msg: "La categoria es: ",

      categoria,
    });
  } else {
    res.status(200).json({
      msg: "La categoria es: ",
      estado: "Eliminado",
      categoria,
    });
  }
}

async function actualizarCategoria(req, res = response) {
  //tomar el id para enviar en la consulta
  const { id } = req.params;

  //crear un objeto con los datos
  const { estado, usuario, ...resto } = req.body; //pueda que en el front envien estado y usuario y no queremos actualizar con esos datos los extrameos y solo mandamos el resto.

  resto.nombre = resto.nombre.toUpperCase(); // a el resto le subimos a mayúsculas
  resto.usuario = req.usuario._id; // y le agregamos el id de usuario que viene de validar token y se pasa directo al request
  try {
    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, resto); // se manda a actualizar
    res.status(200).json({
      msg: "Se actualizo correctamente",
      categoriaActualizada,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Error al actualizar",
    });
  }
}

async function eliminarCategoria(req, res = response) {
  const { id } = req.params;

  const categoriaEliminar = await Categoria.findByIdAndUpdate(id, {
    estado: false,
  });

  res.status(200).json({
    CategoriaEliminada: categoriaEliminar,
    UsuarioElimina: req.usuario._id,
  });
}

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
