import React, { useState, useEffect } from "react";
import "./LogForm.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

/**
 * El componente LogForm muestra el formulario de inicio de sesión.
 * 
 * Este componente muestra un formulario para que el jugador ingrese su nombre y pueda iniciar sesión.
 * 
 * @returns {JSX.Element} Formulario de inicio de sesión
 */

const LogForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  // Funcio que cambia detecta el nuevo nombre
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // Funcion que envia el nombre del usuario al servidor, lo almacena el local storage
  // y envia el jugador al /lobby
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userData = {
      name: name,
    };
    const queryName = new URLSearchParams(userData).toString();

    try {
      const response = await axios.post(`/user?${queryName}`, null, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userId = response.data.id;
      localStorage.setItem("userId", userId);
      navigate("/lobby");
    } catch (error) {
      // console.error("Error: ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No es posible jugar en este momento :( Inténtalo más tarde",
      });
    }
  };

    // Formulario
    return (
    <div className='form-container'>
        <h1>EL SWITCHER</h1>
        <form onSubmit={handleSubmit}>
            <div className='form-group mt-3 w-40'>
                <input 
                    type='text' 
                    className='form-control' 
                    placeholder='Ingresar tu nombre'
                    maxLength={10}
                    required 
                    onChange={handleChange}
                    />
            </div>
            <button type="submit" className='btn custom-button w-100'>JUGAR</button>
        </form>
    </div>
  );
};

export { LogForm };
