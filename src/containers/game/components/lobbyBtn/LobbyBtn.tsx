import React, { useEffect, useState } from "react";
import "./LobbyBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/**
 * Componente de boton para volver al lobby
 *
 * Muestra un boton durante la partida que le permite al usuario volver al lobby
 * en cualquier momento sin abandonar la partida. Al clickearlo limpia el
 * almacenamiento de la partida y redirecciona al usuario al lobby.
 *
 * @returns {JSX.Element} Boton para volver al lobby.
 */
const LobbyBtn = () => {
  // Hook para redirigir a otra ruta
  const navigate = useNavigate();

  // Handler del evento para volver al lobby
  const handleClick = () => {
    // Limpia sessionStorage
    sessionStorage.clear();

    // Redireccion del usuario luego de abandonar
    navigate("/lobby");
  };

  // Renderizacion del boton
  return (
    <button
      type="submit"
      className="btn btn-lg buttom-lobby"
      onClick={handleClick}
    >
      VOLVER AL LOBBY
    </button>
  );
};

export default LobbyBtn;
