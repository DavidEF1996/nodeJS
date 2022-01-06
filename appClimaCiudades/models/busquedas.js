class ModeloCiudad {
  historial = [];

  async buscarCiudad(ciudad = "") {
    console.log(ciudad);

    return []; //retorna los lugares que coincidan con lo que eligio
  }
}

//Cuando estamos seguros que solo vamos a exprtar una cosa en este caso una clase, solo exportamos eso y no como objeto
module.exports = ModeloCiudad;
