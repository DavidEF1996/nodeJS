const { validarCampos } = require("../middlewares/validaciones");
const { Router } = require("express");
const { check } = require("express-validator");
const { login, google } = require("../controllers/auth");
const { existEmail } = require("../helpers/db-validations");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es requerido").not().isEmpty(),
    check("correo", "Este correo no es válido").isEmail(),
    check("password", "La contraseña es requerida").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "El id es requerido").not().isEmpty(), validarCampos],
  google
);

module.exports = router;
