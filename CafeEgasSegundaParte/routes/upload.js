const { Router } = require("express");
const { subirArchivo } = require("../controllers/upload");

const router = Router();

router.get("/", subirArchivo);

module.exports = router;
