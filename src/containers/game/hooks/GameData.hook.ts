import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { GameData } from "../utils/interfaces";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useGame = () => {
  const [game, setGame] = useState<GameData | null>(null);
  const [gameInfoKey, setGameInfoKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);
    const getData = async () => {
      await axios
        .get(`/gamelist/${gameId}`)
        .then((response) => {
          setGame(response.data);
        })
        .catch((error) => {
          console.error("Error fetching the game list:", error);
        });
    };

    socket.onopen = () => {
      console.log("WebSocket connection established");
      getData();
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received");
      setGameInfoKey((prevKey) => prevKey + 1);
      const message = event.data;

      if (message.includes("winner")) {
        const winner = message.replace("winner ", "");
        if (winner == localStorage.getItem("userId"))
          Swal.fire({
            title: "¡Ganaste!",
            text: "Felicidades, has ganado la partida.",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        navigate("/lobby");
      } else {
        getData();
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);
  return { game, gameInfoKey };
};
