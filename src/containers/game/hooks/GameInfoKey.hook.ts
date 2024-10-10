import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useGameInfoKey = () => {
  const [gameInfoKey, setGameInfoKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received");
      setGameInfoKey((prevKey) => prevKey + 1); // Update key to force re-render
      const message = event.data;
      switch (message) {
        case "winner":
          Swal.fire({
            title: "¡Ganaste!",
            text: "Felicidades, has ganado la partida.",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          navigate("/lobby");
          break;

        default:
          // alert("Actualizar info partida");
          console.log(message);
          break;
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

  return gameInfoKey;
};
