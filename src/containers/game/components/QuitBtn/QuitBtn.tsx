import React, { useEffect, useState } from "react";
import "./QuitBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/**
 * Componente de boton para abandonar una partida
 *
 * @remaks
 * Muestra un boton durante la partida que le permite al usuario
 * abandonar en cualquier momento. Al clickearlo (y si la HTTP
 * request es exitosa) el jugador es redirigido al obby
 *
 * @returns {JSX.Element}
 */
const QuitBtn = () => {
  const navigate = useNavigate(); // Hook para redirigir a otra ruta

  // Handler del evento para abandonar partida
  const handleQuit = () => {
    const userId = sessionStorage.getItem("playerId");
    try {
      // PUT request para que el jugador abandone la partida
      const response = axios.put(`/gamelist/leave/${userId}`);

      // Redireccion del usuario luego de abandonar
      navigate("/lobby");
    } catch (error) {
      // Muestra el error en la consola en caso de que falle la solicitud
      console.log(error);
    }
  };

  // Renderizacion del botón
  return (
    <button
      type="submit" // Tipo de botón
      className="btn btn-lg w-20 bottom-quit" // Clases para aplicar estilo
      onClick={handleQuit} // Llama a la función quit al hacer clic
    >
      ABANDONAR PARTIDA
    </button>
  );
};

export default QuitBtn;
