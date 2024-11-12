import React, { useEffect } from "react";
import "./Home.css"; // Importar el archivo CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { LogForm } from "./components/LogForm"; // Importar el componente Form
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * El componente Home muestra el formulario de inicio de sesión.
 * 
 * Este componente muestra un formulario para que el jugador ingrese su nombre y pueda iniciar sesión.
 * Limpia el storage antes de mostrar el formulario.
 * 
 * @returnsn {JSX.Element} Formulario de inicio de sesión
 */

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      console.log(localStorage.getItem("userId"));
      if(localStorage.getItem("userId") != null){
        // get the user name:
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`/user`);
        const users = response.data;
        if (users.length > 0) {
          const user= users.find((user: any) => user.id_user == userId);
          const userName = user.nombre;
          console.log("userName", userName);
          console.log("users", users);
          Swal.fire({
            icon: "info",
            title: "¡Bienvenido de nuevo!",
            text: `${userName} tiene una sesión activa, deseas recuperarla?`,
            showCancelButton: true,
            cancelButtonText: "NO",
            confirmButtonText: "SI",
            preConfirm: () => {
              navigate("/lobby");
            },
            preDeny: () => {
              localStorage.clear();
              sessionStorage.clear();
            }
          });
        } else {
          localStorage.clear();
          sessionStorage.clear();
        }
      } else{
        localStorage.clear();
        sessionStorage.clear();
      }
    };

    checkSession();
  }, []);

  return (
    <div className="home-container">
      <LogForm />
    </div>
  );
};

export default Home;
