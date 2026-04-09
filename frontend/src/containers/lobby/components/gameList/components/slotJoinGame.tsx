/**
 * @file slotJoinGame.tsx
 * @description Componente para unirse a un juego desde la lista de juegos en el lobby.
 *
 * @module SlotJoinGame
 *
 * @requires react
 * @requires sweetalert2
 * @requires axios
 * @requires react-router-dom
 * @requires @fortawesome/react-fontawesome
 * @requires @fortawesome/free-solid-svg-icons
 */

import React from "react";
import Swal from "sweetalert2";
import "./slotJoinGame.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

/**
 * @interface GameProps
 * @description Propiedades del juego.
 * @property {number} id - ID del juego.
 * @property {string} name - Nombre del juego.
 * @property {number} currentCapacity - Capacidad actual del juego.
 * @property {number} capacity - Capacidad máxima del juego.
 * @property {boolean} is_private - Indica si el juego es privado.
 * @property {string} password - Contraseña del juego (si es privado).
 * @property {boolean} started - Indica si el juego ha comenzado.
 */
export interface GameProps {
  id: number;
  name: string;
  currentCapacity: number;
  capacity: number;
  is_private: boolean;
  password: string;
  started: boolean;
}

/**
 * @interface JoinResponse
 * @description Respuesta de la solicitud para unirse a un juego.
 * @property {number} id_player - ID del jugador.
 * @property {number} id_partida - ID de la partida.
 */
interface JoinResponse {
  id_player: number;
  id_partida: number;
}

/**
 * @function changeBackground
 * @description Cambia el color de fondo del botón al pasar el ratón por encima.
 * @param {React.MouseEvent} e - Evento del ratón.
 */
function changeBackground(e) {
  e.target.style.background = "#6ec5e1";
}

/**
 * @function restoreBackground
 * @description Restaura el color de fondo del botón al quitar el ratón de encima.
 * @param {React.MouseEvent} e - Evento del ratón.
 */
function restoreBackground(e) {
  e.target.style.background = "#7eb65b";
}

/**
 * @function SlotJoinGame
 * @description Componente para unirse a un juego.
 * @param {GameProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX del componente.
 */
export default function SlotJoinGame({
  id,
  name,
  currentCapacity,
  capacity,
  is_private,
  password,
}: GameProps) {
  const navigate = useNavigate();

  /**
   * @function joinGame
   * @description Función para unirse a un juego.
   * @param {number} id - ID del juego.
   * @returns {Promise<void>} Promesa que se resuelve cuando el jugador se une al juego.
   */
  const joinGame = async (id) => {
    try {
      if (is_private) {
        const result = await Swal.fire({
          title: "Ingrese la contraseña",
          input: "password",
          confirmButtonText: "Unirse",
          confirmButtonColor: "#7eb65b",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          cancelButtonColor: "#d33",
          inputValidator: (value) => {
            if (!value) {
              return "Debes ingresar una contraseña";
            }
          },
        });

        if (!result.isConfirmed || result.value !== password) {
          if (result.isConfirmed) {
            await Swal.fire({
              icon: "error",
              title: "Contraseña incorrecta",
              text: "Por favor, intenta de nuevo.",
            });
          }
          return;
        }
      }

      const userId = localStorage.getItem("userId");
      const joinData = {
        user_id: userId,
      };

      const joinQueryString = new URLSearchParams(joinData as any).toString();
      await axios
        .put(`/gamelist/join/${id}?${joinQueryString}`, null, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          sessionStorage.setItem("playerId", response.data.id_player);
          console.log(`Player id:${response.data.id_player}`);
        });
      sessionStorage.setItem("gameId", id.toString());
      navigate("/pregame");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al unirse al juego. Por favor, inténtalo de nuevo.",
      });
    }
  };

  let full;
  if (currentCapacity >= capacity) {
    full = true;
  } else {
    full = false;
  }

  return (
    <article id="slotPartida">
      <span id="idPartida">ID: {id}</span>
      <span id="nombrePartida">{name}</span>
      {is_private && (
        <span id="candadoPartida">
          <FontAwesomeIcon icon={faLock} />
        </span>
      )}
      <aside id="capacidadPartida">
        {currentCapacity}/{capacity}
      </aside>
      <button
        id="botonUnirse"
        onMouseOver={full ? undefined : changeBackground}
        onMouseLeave={full ? undefined : restoreBackground}
        onClick={full ? undefined : () => joinGame(id)}
        style={{
          background: full ? "#9b9b9b" : "#7eb65b",
          cursor: full ? "not-allowed" : "pointer",
        }}
        disabled={full}
      >
        {full ? "Lleno" : "Unirse"}
      </button>
    </article>
  );
}
