import React from "react";
import "./GameBoard.css";
import ColorTyle from "./ColorTyle";
import { useState } from "react";
import { useBoard } from "../../hooks/BoardData.hook";
import { Casilla } from "../../utils/interfaces";

const GameBoard = () => {
  const { board } = useBoard();
  board?.casillas.sort((a: Casilla, b: Casilla) =>
    a.fila == b.fila ? a.columna - b.columna : a.fila - b.fila
  );

  return (
    <>
      {board == null ? (
        ""
      ) : (
        <div className="boardSquare boardGrid">
          {board.casillas.map((tyle) => (
            <ColorTyle
              key={tyle.id_casilla}
              tyleId={tyle.id_casilla}
              col={tyle.columna}
              row={tyle.fila}
              color={tyle.color}
              tipo_figura={tyle.figura}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GameBoard;
