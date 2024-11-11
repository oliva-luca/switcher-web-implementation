import React, { useEffect, useState } from "react";
import "./cancelMov.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";

/**
 * Componente de boton para cancelar movimiento
 *
 * Componente CancelMov que permite al jugador cancelar sus movimientos durante su turno.
 * Este componente muestra un botón que, al hacer clic, envía una solicitud al servidor para
 * cancelar los movimientos del jugador actual si es su turno.
 *
 * @returns {JSX.Element} El botón de cancelar movimientos.
 */
const CancelMov = () => {
  // Obtiene el turno actual del contexto de juego.
  const { currentTurn } = useCurrentPlay();

  // Handler del evento para cancelar movimiento
  const handleCancel = async () => {
    const gameId = sessionStorage.getItem("gameId");

    // Verifica si es el turno del jugador
    if (currentTurn == sessionStorage.getItem("playerId")) {
      try {
        // PUT request para cancelar los movimientos en el servidor
        await axios.put(`/gamelist/cancelmoves/${gameId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Renderizacion del boton
  return (
    <button
      type="submit"
      className="btn btn-lg w-20 bottom-cancel"
      onClick={handleCancel}
    >
      CANCELAR MOVIMIENTOS
    </button>
  );
};

export default CancelMov;
