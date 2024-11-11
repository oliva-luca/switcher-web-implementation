import React from "react";
import "./passTurn.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";
import { useEffect, useState } from "react";

const PassTurn = () => {
  const { setSelectedCard, setSelectedTyle, currentTurn, setCurrentTurn } =
    useCurrentPlay();
  const [nameTurn, setNameTurn] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameId = sessionStorage.getItem("gameId");
        const response = await axios.get(`/gamelist/${gameId}`);
        setCurrentTurn(response.data.turn);
        if (response.data.turn !== undefined) {
          const toFind = response.data.turn;
          const response2 = await axios.get(`/user/${toFind}`);
          setNameTurn(response2.data.nombre);
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, []);

  return (
    <div className="pass-turn">
      <div className="text-center top-right-text"> TURNO DE</div>
      <div className="text-center top-right-text">
        {" "}
        {nameTurn ? nameTurn : ""}{" "}
      </div>
      <Button
        variant="primary"
        disabled={
          !currentTurn ||
          currentTurn !== Number(sessionStorage.getItem("playerId"))
        }
        className={
          !currentTurn ||
          currentTurn === Number(sessionStorage.getItem("playerId"))
            ? "blue-button"
            : "gray-button"
        }
        onClick={async () => {
          try {
            const gameId = sessionStorage.getItem("gameId");
            await axios.put(`/end_turn/${gameId}`);
            setSelectedCard(null);
            setSelectedTyle(null);
          } catch (error) {
            console.error("Error ending turn:", error);
          }
        }}
      >
        PASAR TURNO
      </Button>
    </div>
  );
};

export default PassTurn;
