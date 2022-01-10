const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  console.log(req.params);
  const errres = validationResult(req);
  if (!errres.isEmpty()) {
    return res.status(400).json(errres);
  }
  next();
};

module.exports = {
  validarCampos,
};
