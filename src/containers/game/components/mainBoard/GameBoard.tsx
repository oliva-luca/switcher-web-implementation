import "./GameBoard.css";
import ColorTyle from "./ColorTyle";
import { useEffect, useState } from "react";
import axios from "axios";

interface Casillas {
  id_casilla: number;
  color: string;
  columna: number;
  fila: number;
  id_tablero: number;
}

interface BoardData {
  color_principal: number;
  id_tablero: number;
  casillas: Casillas[];
}

const GameBoard = () => {
  const [board, setBoard] = useState<BoardData | null>(null);
  useEffect(() => {
    const gameId = localStorage.getItem("gameId");

    axios
      .get(`/tableros/${gameId}`)
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  const handleClick = (row: number, column: number) =>
    console.log(row + "," + column);

  return (
    <>
      {board == null ? (
        "Couldn't load board"
      ) : (
        <div className="boardSquare boardGrid">
          {board?.casillas.map((tyle) => (
            <ColorTyle
              key={tyle.id_casilla}
              color={tyle.color}
              onClick={() => handleClick(tyle.fila, tyle.columna)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GameBoard;
