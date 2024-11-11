import { GameProps } from "../gameList/components/slotJoinGame";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./slotJoinStartedGame.css";
import React from "react";


export interface JoinProps {
    id: number;
    name: string;
    currentCapacity: number;
    capacity: number;
    started: boolean;
    playerId: number;
  }


export default function SlotJoinStartedGame({
  id,
  name,
  started,
  playerId
}: JoinProps) {
  const navigate = useNavigate();

  const reJoinGame = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const joinData = {
        user_id: userId,
      };

      sessionStorage.setItem("gameId", id.toString());
      sessionStorage.setItem("playerId", playerId.toString());

      if (started) {
        navigate("/game");
      }
      else {
        navigate("/pregame");
      }

    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al unirse al juego. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <button id="re-join_button" onClick={reJoinGame}> Re-Join Game ({name}) </button>
  );
}