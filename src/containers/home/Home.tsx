import React, { useEffect } from "react";
import "./Home.css"; // Importar el archivo CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { LogForm } from "./components/LogForm"; // Importar el componente Form

const Home = () => {
  // Limpia el ID de storage
  useEffect(() => {
    localStorage.removeItem("userId");
    sessionStorage.removeItem("gameId");
  }, []);

  return (
    <div className="home-container">
      <LogForm />
    </div>
  );
};

export default Home;
