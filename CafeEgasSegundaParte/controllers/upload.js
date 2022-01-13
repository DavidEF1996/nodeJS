const { response } = require("express");

const subirArchivo = (req, res = response) => {
  return res.status(200).json({
    msg: "llegue",
  });
};

module.exports = {
  subirArchivo,
};
