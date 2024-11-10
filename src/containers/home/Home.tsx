import React, { useEffect } from "react";
import "./Home.css"; // Importar el archivo CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { LogForm } from "./components/LogForm"; // Importar el componente Form

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
