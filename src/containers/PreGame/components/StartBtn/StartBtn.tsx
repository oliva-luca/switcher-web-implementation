import React, { useEffect, useState } from "react";
import "./StartBtn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Importar Axios
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/**
  * El componente StartBtn muestra el botón de inicio de la partida.
  * 
  * Este componente muestra el botón de inicio de la partida si el jugador es el propietario del juego.
  * Si el jugador no es el propietario del juego, muestra el botón de salida de la partida.
  * 
  * @returns {JSX.Element} El botón de inicio de la partida o el botón de salida de la partida.
 */


const StartBtn = () => {
  const navigate = useNavigate();
  const [idOwner, setIdOwner] = useState(null);
  const playerId = sessionStorage.getItem("playerId");

  // Obtiene los datos del juego para determinar si el jugador es el propietario del juego
  useEffect(() => {
    const fetchGameData = async () => {
      const gameId = sessionStorage.getItem("gameId");
      if (!gameId) {
        console.error("Game ID not found");
        return;
      }

      try {
        const response = await axios.get(`/gamelist/${gameId}`);
        // console.log('Game:', response.data);
        setIdOwner(response.data.owner); // Actualiza el estado con el ID del propietario
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, []);

  // Inicia la partida
  const start = async () => {
    const gameId = sessionStorage.getItem("gameId");
    if (!gameId) {
      console.error("Game ID not found");
    } else{
      try {
        const response = await axios.put(`/gamelist/start/${gameId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        navigate("/game");
      } catch (error) {
        // en caso de error, muestra una alerta
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Se necesitan más jugadores para comenzar",
        });
      }
    }
  };

  const exit = async () => {
    const playerId = sessionStorage.getItem("playerId");
    try {
      await axios.put(`/gamelist/leave_lobby/${playerId}`);
      navigate("/lobby");
    } catch (error) {
      console.log(error);
    }
  };

  // Muestra el botón de inicio de la partida si el jugador es el propietario del juego
  if (idOwner == playerId) {
    return (
      <button
        type="submit"
        className="btn btn-lg w-20 bottom-right-button"
        onClick={start}
      >
        INICIAR PARTIDA
      </button>
    );
  } else {
    // Muestra el botón de salida de la partida si el jugador no es el propietario del juego
    return (
      <button
        type="submit"
        className="btn btn-lg w-20 bottom-right-button-exit"
        onClick={exit}
      >
        ABANDONAR PARTIDA
      </button>
    );
  }
};

export default StartBtn;
