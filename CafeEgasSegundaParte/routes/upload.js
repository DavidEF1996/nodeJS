const { Router } = require("express");
const { check } = require("express-validator");
const {
  subirArchivo,
  actualizarProfileProducto,
  obtenerImgen,
} = require("../controllers/upload");
const { colecccionesPermitidas } = require("../helpers/subida-archivos");
const { validarCampos } = require("../middlewares/validaciones");

const router = Router();

router.post("/", subirArchivo);

router.put(
  "/:coleccion/:id",
  [
    check("id", "No es un id de mongo válido").isMongoId(),
    check("coleccion").custom((e) =>
      colecccionesPermitidas(e, ["users", "productos"])
    ),
    validarCampos,
  ],
  actualizarProfileProducto
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "No es un id de mongo válido").isMongoId(),
    check("coleccion").custom((e) =>
      colecccionesPermitidas(e, ["users", "productos"])
    ),
    validarCampos,
  ],
  obtenerImgen
);
module.exports = router;
