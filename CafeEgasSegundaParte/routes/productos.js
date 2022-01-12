const { validarCampos } = require("../middlewares/validaciones");
const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarToken,
  validarCategoria,
  existeCategoria,
  existeProducto,
} = require("../middlewares/validar-jwt");
const { existeId } = require("../middlewares/validacionesProductos");
const {
  crearProducto,
  actualizarProducto,
  listarProductos,
  listarProducto,
  eliminarProducto,
} = require("../controllers/productos");

const router = Router();

//Listar todo publico
router.post(
  "/",
  [
    [
      validarToken,
      check("categoria", "La categoria es requerida").not().isEmpty(),
      check("categoria").custom(existeCategoria),
      //check("id").custom(existeProducto),
      check("nombre", "El nombre es requerido").not().isEmpty(),

      validarCampos,
    ],
  ],
  crearProducto
);

router.put(
  "/:id",
  [
    validarToken,
    check("categoria", "No es una categoria válida").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  actualizarProducto
);

router.get("/", listarProductos);
router.get(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  listarProducto
);
router.delete(
  "/:id",
  [
    validarToken,
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  eliminarProducto
);

module.exports = router;
