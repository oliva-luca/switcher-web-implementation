import React from "react";
import "./FigureBoard.css";
import FigureCard from "./FigureCard";
import { FigCard } from "../../utils/interfaces";

// Interfaz de propiedades del componente
interface FigureBoardProp {
  pos: string; // Posición del tablero para tablero (puede ser 'btm', 'rgt', 'top', 'lft')
  deck: number; // Número de cartas en el mazo del jugador
  cards: FigCard[]; // Lista de cartas de figura del jugador
  name: string; // Nombre del jugador
}

/**
 * Componente del tablero de figuras
 *
 * Este componente muestra el tablero de figuras de un jugador en función de su posicion.
 * Dependiendo de la posicion proporcionada (`pos`), se renderiza la interfaz del tablero
 * con las cartas de figura del jugador, el numero de cartas en el mazo, y el nombre del jugador.
 * Cada carta de figura es representada por el componente `FigureCard`.
 *
 * @param {FigureBoardProp}
 * - `pos` (string): Posicion del tablero para la figura. Puede ser: 'btm' (abajo), 'rgt' (derecha), 'top' (arriba), 'lft' (izquierda).
 * - `deck` (number): Numero de cartas en el mazo del jugador.
 * - `cards` (FigCard[]): Lista de cartas de figura del jugador, donde cada carta tiene una serie de propiedades.
 * - `name` (String): Nombre del jugador.
 *
 * @returns {JSX.Element} Tablero de figuras de un jugador.
 */
const FigureBoard = ({ pos, deck, cards, name }: FigureBoardProp) => {
  return (
    <>
      {pos === "btm" && (
        <div className="figureBoard figureGrid ply1">
          <div className="playerName">{name}</div>
          <div className="figureDeck ply1">{deck}</div>
          {cards.map((card) => (
            <FigureCard
              key={card.id_figcard}
              cardID={card.id_figcard}
              type={card.type}
              playerID={card.id_jugador}
              blocked={card.blocked}
            />
          ))}
        </div>
      )}
      {pos === "rgt" && (
        <div className="figureBoardSide figureGridSide ply2">
          {cards.map((card) => (
            <FigureCard
              key={card.id_figcard}
              cardID={card.id_figcard}
              type={card.type}
              playerID={card.id_jugador}
              blocked={card.blocked}
            />
          ))}
          <div className="figureDeck ply2">{deck}</div>
          <div className="playerName">{name}</div>
        </div>
      )}
      {pos === "top" && (
        <div className="figureBoard figureGrid ply3">
          {cards.map((card) => (
            <FigureCard
              key={card.id_figcard}
              cardID={card.id_figcard}
              type={card.type}
              playerID={card.id_jugador}
              blocked={card.blocked}
            />
          ))}
          <div className="figureDeck ply3">{deck}</div>
          <div className="playerName">{name}</div>
        </div>
      )}
      {pos === "lft" && (
        <div className="figureBoardSide figureGridSide ply4">
          <div className="playerName">{name}</div>
          <div className="figureDeck ply4">{deck}</div>
          {cards.map((card) => (
            <FigureCard
              key={card.id_figcard}
              cardID={card.id_figcard}
              type={card.type}
              playerID={card.id_jugador}
              blocked={card.blocked}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default FigureBoard;