import React, { useEffect, useState } from "react";
import "./QuitBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/**
 * Componente de boton para abandonar una partida
 *
 * Muestra un boton durante la partida que le permite al usuario abandonar
 * en cualquier momento. Al clickearlo hace la HTTP request al servidor a
 * partir del playerId guardando en el almacenamiento de session y el jugador
 * es redirigido al lobby.
 *
 * @returns {JSX.Element} Boton para abandonar la partida.
 */
const QuitBtn = () => {
  // Hook para redirigir a otra ruta
  const navigate = useNavigate();

  // Handler del evento para abandonar partida
  const handleQuit = () => {
    const playerId = sessionStorage.getItem("playerId");
    try {
      // PUT request para que el jugador abandone la partida
      const response = axios.put(`/gamelist/leave/${playerId}`);

      // Redireccion del usuario luego de abandonar
      navigate("/lobby");
    } catch (error) {
      // Muestra un error si la solicitud falla
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
