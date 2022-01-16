const { Router } = require("express");
const { subirArchivo } = require("../controllers/upload");

const router = Router();

router.post("/", subirArchivo);

module.exports = router;
