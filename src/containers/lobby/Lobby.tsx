/**
 * @fileoverview Este archivo contiene el componente Lobby, que es el contenedor principal para la pantalla de lobby de la aplicación.
 *
 * @module Lobby
 */

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Lobby.css";
import CreateGame from "./components/createGame/createGame";
import GameList from "./components/gameList/gameList";
import { FilterProvider } from "./components/filters/FilterContext";
import Filters from "./components/filters/Filter";
import InGameList from "./components/inGameList/InGameList";
import Swal from "sweetalert2";

/**
 * Componente principal del lobby que maneja la conexión WebSocket y la navegación del usuario.
 *
 * @component
 * @returns {JSX.Element} El componente Lobby.
 *
 * @example
 * <Lobby />
 */
export function Lobby() {
  const [isConnected, setIsConnected] = useState(false);
  const [gameListKey, setGameListKey] = useState(0);
  const navigate = useNavigate();

  /**
   * Verifica si el usuario está autenticado. Si no lo está, muestra una alerta y redirige al home.
   */
  if (localStorage.getItem("userId") == null) {
    Swal.fire({
      text: "Error cargando datos de usuario",
      confirmButtonText: "Volver al home",
    }).finally(() => {
      localStorage.clear();
      navigate("/");
    });
  }

  sessionStorage.clear();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    /**
     * Maneja la apertura de la conexión WebSocket.
     */
    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };

    /**
     * Maneja la recepción de mensajes a través del WebSocket.
     */
    socket.onmessage = () => {
      console.log("WebSocket message received");
      setGameListKey((prevKey) => prevKey + 1);
    };

    /**
     * Maneja el cierre de la conexión WebSocket.
     */
    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    /**
     * Maneja errores en la conexión WebSocket.
     */
    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="contenedor">
      <div className="partidas">
        <div className="started-games-section">
          <h2 className="title">Partidas en curso</h2>
          <InGameList key={"ingame" + gameListKey} />
        </div>

        <div className="join-game-section">
          <h2 className="title">Unirse a partida</h2>
          <FilterProvider>
            <Filters />
            <GameList key={gameListKey} />
          </FilterProvider>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center">
        <h2 className="title">Crear partida</h2>
        <CreateGame />
      </div>
    </div>
  );
}

export default Lobby;
