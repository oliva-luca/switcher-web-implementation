import React from "react";
import "./GameBoard.css";
import ColorTyle from "./ColorTyle";
import { useEffect, useState } from "react";
import axios from "axios";

interface Casilla {
  id_casilla: number;
  color: string;
  columna: number;
  fila: number;
  id_tablero: number;
}

interface BoardData {
  color_principal: number;
  id_tablero: number;
  casillas: Casilla[];
}

const GameBoard = () => {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [selectedTyle, setSelectedTyle] = useState<[number, number] | null>(
    null
  );

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

  board?.casillas.sort((a: Casilla, b: Casilla) =>
    a.fila == b.fila ? a.columna - b.columna : a.fila - b.fila
  );

  return (
    <>
      {board == null ? (
        "Couldn't load board"
      ) : (
        <div className="boardSquare boardGrid">
          {board.casillas.map((tyle) => (
            <ColorTyle
              key={tyle.id_casilla}
              col={tyle.columna}
              row={tyle.fila}
              color={tyle.color}
              selected={selectedTyle}
              setSelected={setSelectedTyle}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GameBoard;
