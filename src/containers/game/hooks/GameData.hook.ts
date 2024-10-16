import { useEffect, useState } from "react";
import axios from "axios";
import { GameData, Player } from "../utils/interfaces";

export const useGame = () => {
  const [game, setGame] = useState<GameData | null>(null);

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = () => {
      axios
        .get(`/gamelist/${gameId}`)
        .then((response) => {
          setGame(response.data);
        })
        .catch((error) => {
          console.error("Error fetching the game list:", error);
        });
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return game;
};
