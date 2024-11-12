import React from "react";
import "./GameBoard.css";
import ColorTyle from "./ColorTyle";
import { useState } from "react";
import { useBoard } from "../../hooks/BoardData.hook";
import { Casilla } from "../../utils/interfaces";

/**
 * Componente de tablero de fichas de colores
 *
 * Renderiza un tablero de juego basado en los datos de las casillas obtenidos
 * del hook `useBoard`. Cada casilla es representada por un componente `ColorTyle`,
 * que se coloca en una cuadrícula según las propiedades `fila` y `columna`.
 *
 * @returns {JSX.Element} Tablero 6x6 de `ColorTyle`
 */
const GameBoard = () => {
  // Obtiene los datos del tablero usando el hook `useBoard`
  const { board } = useBoard();

  // Ordena las casillas por fila y columna
  board?.casillas.sort((a: Casilla, b: Casilla) =>
    a.fila == b.fila ? a.columna - b.columna : a.fila - b.fila
  );

  return (
    <>
      {board == null ? (
        "" // Si no hay datos del tablero, no renderiza nada
      ) : (
        <div className="boardSquare boardGrid">
          {/* Mapea las casillas para renderizar un componente `ColorTyle` por cada casilla */}
          {board.casillas.map((tyle) => (
            <ColorTyle
              key={tyle.id_casilla}
              tyleId={tyle.id_casilla}
              col={tyle.columna}
              row={tyle.fila}
              color={tyle.color}
              blocked={board.color_prohibido == tyle.color}
              tipo_figura={tyle.figura}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GameBoard;
