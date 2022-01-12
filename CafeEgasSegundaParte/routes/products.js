const { validarCampos } = require("../middlewares/validaciones");
const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categorias");
const { validarToken } = require("../middlewares/validar-jwt");
const { existeId } = require("../middlewares/validacionesProductos");

const router = Router();

//Listar todo publico
router.get("/", obtenerCategorias);

//Lista una categoria publico
router.get(
  "/:id",
  [
    check("id", "No es un id mongo valido").isMongoId(),
    check("id").custom(existeId),
    validarCampos,
  ],
  obtenerCategoria
);

//crear categoria y solo token válido
router.post(
  "/",
  [
    validarToken,
    check("nombre", "El nombre es requerido").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//actualizar categoria y solo token válido
router.put(
  "/:id",
  [
    validarToken,
    check("id", "No es un id mongo valido").isMongoId(),
    check("id").custom(existeId),
    validarCampos,
  ],
  actualizarCategoria
);

//actualizar categoria y solo token válido
router.delete(
  "/:id",
  [
    validarToken,
    check("id", "No es un id mongo valido").isMongoId(),
    check("id").custom(existeId),
    validarCampos,
  ],
  eliminarCategoria
);

module.exports = router;
