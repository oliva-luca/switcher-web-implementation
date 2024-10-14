import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timer.css";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";

const Timer: React.FC = () => {
  const { setSelectedCard, setSelectedTyle } = useCurrentPlay();
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);
    socket.onmessage = () => {
      setTimeLeft(120);
    };
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const endTurn = async () => {
      try {
        const gameId = localStorage.getItem("gameId");
        await axios.put(`/end_turn/${gameId}`);
        setSelectedCard(null);
        setSelectedTyle(null);
        setTimeLeft(120);
      } catch (error) {
        console.error("Error ending turn:", error);
      }
    };

    if (timeLeft === 0) {
      endTurn();
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
