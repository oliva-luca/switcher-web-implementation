import { useEffect, useState } from "react";
import axios from "axios";
import { BoardData } from "../utils/interfaces";

export const useBoard = () => {
  const [board, setBoard] = useState<BoardData | null>(null);

  useEffect(() => {
    const gameId = sessionStorage.getItem("gameId");

    axios
      .get(`/tableros/${gameId}`)
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  return { board, setBoard };
};
