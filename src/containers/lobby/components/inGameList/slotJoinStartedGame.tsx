/**
 * @file slotJoinStartedGame.tsx
 * @description Componente para unirse a un juego ya iniciado desde la lista de juegos en el lobby.
 */

import { GameProps } from "../gameList/components/slotJoinGame";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./slotJoinStartedGame.css";
import React from "react";

/**
 * @interface JoinProps
 * @description Propiedades necesarias para unirse a un juego.
 * @property {number} id - ID del juego.
 * @property {string} name - Nombre del juego.
 * @property {number} currentCapacity - Capacidad actual del juego.
 * @property {number} capacity - Capacidad máxima del juego.
 * @property {boolean} started - Indica si el juego ya ha comenzado.
 * @property {number} playerId - ID del jugador.
 */

export interface JoinProps {
  id: number;
  name: string;
  currentCapacity: number;
  capacity: number;
  started: boolean;
  playerId: number;
}

/**
 * @function SlotJoinStartedGame
 * @description Componente que permite a un jugador unirse a un juego ya iniciado.
 * @param {JoinProps} props - Propiedades necesarias para unirse al juego.
 * @returns {JSX.Element} Botón que permite al jugador unirse al juego.
 */
export default function SlotJoinStartedGame({
  id,
  name,
  started,
  playerId,
}: JoinProps) {
  const navigate = useNavigate();

  /**
   * @function reJoinGame
   * @description Función asíncrona que maneja la lógica para que un jugador se una a un juego ya iniciado.
   * @returns {Promise<void>}
   */
  const reJoinGame = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const joinData = {
        user_id: userId,
      };

      sessionStorage.setItem("gameId", id.toString());
      sessionStorage.setItem("playerId", playerId.toString());

      if (started) {
        navigate("/game");
      } else {
        navigate("/pregame");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al unirse al juego. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <button id="re-join_button" onClick={reJoinGame}>
      {" "}
      Re-Join Game ({name}){" "}
    </button>
  );
}
