const { response } = require("express");

function esAdminRole(req, res = response, next) {
  //Este método fuerza a que el usuario sea si o si administrador
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Primero se debe verificar el token",
    });
  }
  const { rol } = req.usuario;
  if (rol !== "ADMIN_ROLE") {
    return res.status(500).json({
      msg: "El usuario no tiene permisos de administrador",
    });
  }

  next();
}

function tieneAlgunoDeEstosRoles(...roles) {
  //esta funcion recibe los roles que se envien en el arreglo roles y retorna una funcion que verifica si almenos cumple con alguno de los roles
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Primero se debe verificar el token",
      });
    }
    if (!roles.includes(req.usuario.rol)) {
      res.status(401).json({
        msg: `El usuario debe tener almenos uno de estos roles: ${roles}`,
      });
    }
    next();
  };
}

module.exports = {
  esAdminRole,
  tieneAlgunoDeEstosRoles,
};
