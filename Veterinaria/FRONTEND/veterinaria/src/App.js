import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//importar cliente de axios
import clienteAxios from "./config/axios";
//componentes
import Pacientes from "./components/Pacientes";
import NuevaCita from "./components/NuevaCita";
import Cita from "./components/Cita";

function App() {
  //colocar el estado de la app
  const [pacientes, guardarCitas] = useState([]);
  const [consultar, guardarConsultar] = useState(true);
  useEffect(() => {
    if (consultar) {
      //se lanza cuando se hace algún cambio o cuando se modifica algo
      const consultarAPI = () => {
        clienteAxios
          .get("/veterinaria")
          .then((respuesta) => {
            guardarCitas(respuesta.data.pacientes);
            //deshabilitar la consuta
            guardarConsultar(false);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      consultarAPI();
    }
  }, [consultar]); //los corchetes llevan dependencias si hubieran

  return (
    //Aquí van las rutas, pueden ir las que desess dentro de Switch
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          component={() => <Pacientes citas={pacientes} />}
        />

        <Route
          exact
          path="/nueva"
          component={() => <NuevaCita guardarConsultar={guardarConsultar} />}
        />

        <Route
          exact
          path="/cita/:id"
          render={(props) => {
            const cita = pacientes.filter(
              (cita) => cita._id === props.match.params.id
            );
            console.log(cita);
            return <Cita cita={cita[0]} guardarConsultar={guardarConsultar} />;
          }}
        />
      </Switch>
    </Router>
  );
}

export default App;
