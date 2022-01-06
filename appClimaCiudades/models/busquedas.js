const { default: axios } = require("axios");

class ModeloCiudad {
  historial = [];

  get params() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  async buscarCiudad(ciudad = "") {
    console.log(ciudad);

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
        params: this.params,
      });
      const respuesta = await instance.get();
      return respuesta.data.features.map((lugar) => ({
        id: lugar.id,
        name: lugar.place_name_es,
        lon: lugar.center[0],
        lat: lugar.center[1],
      }));
      //retorna los lugares que coincidan con lo que eligio
    } catch (error) {
      return [];
    }
  }
}

//Cuando estamos seguros que solo vamos a exprtar una cosa en este caso una clase, solo exportamos eso y no como objeto
module.exports = ModeloCiudad;
