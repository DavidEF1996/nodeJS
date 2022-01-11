import axios from "axios";

const clienteAxios = axios.create({
  //tomamos la funcion de crear y pasar un objeto
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default clienteAxios;
