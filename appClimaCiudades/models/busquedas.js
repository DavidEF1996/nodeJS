const fs = require("fs");
const { default: axios } = require("axios");

class ModeloCiudad {
  historial = [];
  lat;
  lon;
  path = "./db/base.json";

  constructor() {
    this.leerBd();
  }

  get params() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }
  get paramsWeather() {
    return {
      lat: this.lat,
      lon: this.lon,
      appid: process.env.OPENWEATHER,
      units: "metric",
      lang: "es",
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

  async climaCiudad(lat, lon) {
    try {
      const instancia = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: this.paramsWeather,
      });
      const respuesta = await instancia.get();
      const { main, weather } = respuesta.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(nombre) {
    if (this.historial.includes(nombre)) {
      return;
    }
    this.historial.unshift(nombre);

    //Guardar en la base
    this.grabarBd();
  }

  grabarBd() {
    const objetoHistorial = {
      historial: this.historial,
    };
    fs.writeFileSync(this.path, JSON.stringify(objetoHistorial));
  }

  leerBd() {
    if (!fs.existsSync(this.path)) {
      return;
    }
    const info = fs.readFileSync(this.path, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

//Cuando estamos seguros que solo vamos a exprtar una cosa en este caso una clase, solo exportamos eso y no como objeto
module.exports = ModeloCiudad;
