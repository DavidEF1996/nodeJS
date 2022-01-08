const { Router } = require("express");
const {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
  getUsersWithParams,
} = require("../controllers/users");
const router = Router();

//Operaciones básicas, la ruta api direccionará a alguna de estas rutas cuando se mande el parámetro de get, post, put, delete
router.get("/", getUsers);

//una ruta para agregar otro de tipo get pero que apunta a otra ruta
router.get("/datos", getUsersWithParams);

//ahora en estas rutas usamos la variable
router.post("/", postUsers);

//al especificarle el id va a ir a los parametros y podremos recibir el id
router.put("/:id", putUsers);

router.delete("/", deleteUsers);

module.exports = router; // se exporta el router
