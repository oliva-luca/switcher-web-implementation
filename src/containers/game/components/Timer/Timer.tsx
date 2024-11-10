import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timer.css";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";

const Timer: React.FC = () => {
  const { setSelectedCard, setSelectedTyle, setSelectedFigureCard } =
    useCurrentPlay();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
    const gameId = sessionStorage.getItem("gameId");
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);
    socket.onopen = async () => {
      const diff = await get_turn_time();
      setTimeLeft(120 - diff);
    };

    socket.onmessage = async (event) => {
      switch (event.data) {
        case "Turno del jugador":
          setTimeLeft(120);
          break;
        default:
          break;
      }
    };
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const endTurn = async () => {
      try {
        const gameId = sessionStorage.getItem("gameId");
        await axios.put(`/end_turn/${gameId}`);
        setTimeLeft(120);
      } catch (error) {
        console.error("Error ending turn:", error);
      }
    };

    if (timeLeft === 0) {
      endTurn();
      setSelectedCard(null);
      setSelectedTyle(null);
      setSelectedFigureCard(null);
    }
  }, [timeLeft]);

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
