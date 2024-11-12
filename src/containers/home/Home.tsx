import React, { useEffect } from "react";
import "./Home.css"; // Importar el archivo CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { LogForm } from "./components/LogForm"; // Importar el componente Form

/**
 * El componente Home muestra el formulario de inicio de sesión.
 * 
 * Este componente muestra un formulario para que el jugador ingrese su nombre y pueda iniciar sesión.
 * Limpia el storage antes de mostrar el formulario.
 * 
 * @returnsn {JSX.Element} Formulario de inicio de sesión
 */

const Home = () => {
  // Limpia storage
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div className="home-container">
      <LogForm />
    </div>
  );
};

export default Home;
