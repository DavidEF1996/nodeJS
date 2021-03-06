const { validarCampos } = require("../middlewares/validaciones");
const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
  getUsersWithParams,
} = require("../controllers/users");
const {
  exisRol,
  existEmail,
  existUserById,
} = require("../helpers/db-validations");
const { validarToken } = require("../middlewares/validar-jwt");
const {
  esAdminRole,
  tieneAlgunoDeEstosRoles,
} = require("../middlewares/validar-rol");

const router = Router();

//Operaciones básicas, la ruta api direccionará a alguna de estas rutas cuando se mande el parámetro de get, post, put, delete
router.get("/", getUsers);

//una ruta para agregar otro de tipo get pero que apunta a otra ruta
router.get("/datos", getUsersWithParams);

//ahora en estas rutas usamos la variable
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("correo").custom(existEmail),
    check("password", "La contraseña mínimo de 6 letras").isLength({ min: 6 }),
    //check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(exisRol), //Normalmente se debe mandar como función de flecha pero como se manda rol y se recibe rol se obvia, mas info en el  125
    validarCampos,
  ],
  postUsers
);

//al especificarle el id va a ir a los parametros y podremos recibir el id
router.put(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(), //verifica si es un id de mongo
    check("id").custom(existUserById), //verifica con una personalizada si existe el id de mongo
    check("rol").custom(exisRol), //verifica el rol
    validarCampos,
  ],
  putUsers
);

router.delete(
  "/:id",
  [
    validarToken,
    //esAdminRole,
    tieneAlgunoDeEstosRoles("ADMIN_ROLE", "USER_ROLE"),
    check("id", "No es un id de Mongo válido").isMongoId(), //verifica si es un id de mongo
    check("id").custom(existUserById), //verifica con una personalizada si existe el id de mongo
    validarCampos,
  ],
  deleteUsers
);

module.exports = router; // se exporta el router
