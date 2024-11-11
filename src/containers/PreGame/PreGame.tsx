import "./PreGame.css";
// import PreGameBoard from './components/GameBoard/PreGameBoard'
import StartBtn from "./components/StartBtn/StartBtn";
import CantPlayer from "./components/CantPlayer/CantPlayer";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CancelBtn from "./components/CancelBtn/CancelBtn";
import Swal from "sweetalert2";

/**
 * Componente PreGame
 * 
 * Componente que muestra la pantalla de espera de jugadores antes de que inicie la partida.
 * 
 * @returns {JSX.Element} Componente PreGame
 */

function PreGame() {
  const navigate = useNavigate();

  // verificar si se tienen los datos de la partida
  if (
    sessionStorage.getItem("gameId") == null ||
    sessionStorage.getItem("playerId") == null
  ) {
    // Si no se tienen los datos de la partida, se redirige al lobby, y muestra error
    Swal.fire({
      text: "Error cargando datos de la partida",
      confirmButtonText: "Volver al lobby",
    }).then(() => {
      sessionStorage.clear();
      navigate("/lobby");
    });
  }

  const [gameInfoKey, setGameInfoKey] = useState(0);

  // Se crea un WebSocket para escuchar los mensajes del servidor
  useEffect(() => {
    let gameId = sessionStorage.getItem("gameId");
    console.log("GAME ID: ", gameId);
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

    // Se escuchan los mensajes del servidor para actualizar la información de la partida
    socket.onmessage = (event) => {
      console.log("WebSocket message received");
      setGameInfoKey((prevKey) => prevKey + 1); // Update key to force re-render
      const message = event.data;
      switch (message) {
        case "Game has started":
          navigate("/game");
          break;
        case "Owner cancelled the game":
          Swal.fire({
            title: "Creador canceló la partida",
            icon: "warning",
            confirmButtonText: "OK",
          });
          navigate("/lobby");
          break;
        default:
          break;
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    // Se envía un mensaje al servidor para unirse a la partida
    return () => {
      socket.close();
    };
  }, []);

  // Devuelve el componente PreGame
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <div className="top-center-text" style={{ zIndex: 3, textAlign: "center", marginTop: "20px" }}>
          <h1>Esperando a que se unan los jugadores...</h1>
        </div>
        <div className="top-left-text" style={{ zIndex: 3, textAlign: "center", marginTop: "20px" }}>
          <CantPlayer key={gameInfoKey} />
        </div>
        <div style={{ zIndex: 3, marginTop: "20px" }}>
          <StartBtn />
        </div>
        <div className="content" style={{ zIndex: 1 }}></div>
        <div style={{ zIndex: 3, marginTop: "20px" }}>
          <CancelBtn />
        </div>
      </div>
    </>
  );
}

export default PreGame;
