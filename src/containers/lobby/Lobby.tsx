import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Lobby.css";
import CreateGame from "./components/createGame/createGame";
import GameList from "./components/gameList/gameList";
import { FilterProvider } from "./components/filters/FilterContext";
import Filters from "./components/filters/Filter";
import InGameList from "./components/inGameList/InGameList";

export function Lobby() {
  const [isConnected, setIsConnected] = useState(false);
  const [gameListKey, setGameListKey] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };

    socket.onmessage = () => {
      console.log("WebSocket message received");
      setGameListKey((prevKey) => prevKey + 1);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="container">
      <div className="join-game-section">
        <h2 className="title">Unirse a partida</h2>
        <FilterProvider>
          <Filters />
          <GameList key={gameListKey} />
          <InGameList />
        </FilterProvider>
      </div>

      <div className="d-flex flex-column align-items-center">
        <h2 className="title">Crear partida</h2>
        <CreateGame />
      </div>
    </div>
  );
}

export default Lobby;
