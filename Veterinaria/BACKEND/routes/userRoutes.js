const { Router } = require("express");
const {
  insertarUsuarios,
  devolverPacientes,
  devolverPaciente,
  actualizar,
  eliminar,
} = require("../controllers/veterinariaControllers");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validaciones");

const router = Router();

router.post(
  "/",
  [
    check("nombre", "El nombre no puede estar vacío").not().isEmpty(),
    check("propietario", "El propietario no puede estar vacío").not().isEmpty(),
    check("fecha", "La fecha no puede estar vacía").not().isEmpty(),
    check("hora", "La hora no puede estar vacía").not().isEmpty(),
    check("sintomas", "Los sintomas no pueden estar vacíos").not().isEmpty(),
    validarCampos,
  ],
  insertarUsuarios
);

router.get("/", devolverPacientes);

router.get(
  "/:id",
  [check("id", "No es un id de Mongo válido").isMongoId(), validarCampos],
  devolverPaciente
);

router.put("/:id", actualizar);

router.delete(
  "/:id",
  [[check("id", "No es un id de Mongo válido").isMongoId(), validarCampos]],
  eliminar
);

module.exports = router;
