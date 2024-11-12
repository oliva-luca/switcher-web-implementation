import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timer.css";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";

/**
 * Componente de temporizador para el juego
 *
 * Este componente muestra el tiempo restante para el turno del jugador,
 * actualiza el tiempo en tiempo real y termina el turno automáticamente
 * cuando el temporizador llega a cero. También maneja las interacciones
 * con el WebSocket y las actualizaciones del servidor.
 *
 * @returns {JSX.Element} Componente de temporizador con el tiempo restante.
 */
const Timer: React.FC = () => {
  const { setSelectedCard, setSelectedTyle, setSelectedFigureCard } =
    useCurrentPlay();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  /**
   * Obtiene el tiempo de turno desde el servidor.
   *
   * @returns {Promise<number>} El tiempo de turno restante en segundos.
   */
  const get_turn_time = async () => {
    try {
      const gameId = sessionStorage.getItem("gameId");
      const response = await axios.get(`/gamelist/turn_time/${gameId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting turn time:", error);
    }
  };

  useEffect(() => {
    // Obtiene el ID del juego y establece la conexión con el WebSocket
    const gameId = sessionStorage.getItem("gameId");
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

    // Al abrir el WebSocket, obtiene el tiempo de turno y ajusta el temporizador
    socket.onopen = async () => {
      const diff = await get_turn_time();
      setTimeLeft(120 - diff);
    };

    // Maneja los mensajes del WebSocket (por ejemplo, cuando es el turno del jugador)
    socket.onmessage = async (event) => {
      switch (event.data) {
        case "Turno del jugador":
          setTimeLeft(120); // Reinicia el tiempo cuando empieza el turno del jugador
          break;
        default:
          break;
      }
    };

    // Intervalo que disminuye el tiempo restante cada segundo
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    /**
     * Termina el turno del jugador y restablece el estado.
     */
    const endTurn = async () => {
      try {
        const gameId = sessionStorage.getItem("gameId");
        await axios.put(`/end_turn/${gameId}`);
        setTimeLeft(120); // Restablece el temporizador a 120 segundos
      } catch (error) {
        console.error("Error ending turn:", error);
      }
    };

    // Si el tiempo restante llega a cero, termina el turno y resetea el estado
    if (timeLeft === 0) {
      endTurn();
      setSelectedCard(null);
      setSelectedTyle(null);
      setSelectedFigureCard(null);
    }
  }, [timeLeft, setSelectedCard, setSelectedTyle, setSelectedFigureCard]);

  /**
   * Formatea el tiempo en segundos a un formato MM:SS.
   *
   * @param {number} seconds - El tiempo en segundos a formatear.
   * @returns {string} El tiempo formateado como "MM:SS".
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="timer">
      <h1 className="text-center">TIEMPO</h1>
      <h1 className="text-center"> RESTANTE</h1>
      <h1 className="text-center">{formatTime(timeLeft)}</h1>
    </div>
  );
};

export default Timer;
