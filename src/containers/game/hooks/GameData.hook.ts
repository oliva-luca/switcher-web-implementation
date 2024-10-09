import { useEffect, useState } from "react";
import axios from "axios";
import { GameData, Player } from "../utils/interfaces";

export const useGame = () => {
  const [game, setGame] = useState<GameData | null>(null);

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");

    axios
      .get(`/gamelist/${gameId}`)
      .then((response) => {
        setGame(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  return game;
};
