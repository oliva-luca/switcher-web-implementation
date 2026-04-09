import React from "react";
import FigureBoard from "./FigureBoard";
import GameBoard from "./GameBoard";
import "./MainBoard.css";
import { Player, FigCard } from "../../utils/interfaces";
import {
  ParsePlayerFigCards,
  ParsePlayerFigDeck,
  ParsePlayers,
} from "../../utils/parsers";

interface MainBoardProp {
  players: Player[];
  num_players: number;
  figcards: FigCard[];
}

/**
 * Componente `MainBoard` que gestiona y muestra el tablero de juego con las figuras de los jugadores y el tablero principal del juego.
 * Dependiendo del número de jugadores, renderiza dinámicamente los componentes `FigureBoard` para cada jugador en diferentes posiciones
 * alrededor del `GameBoard` central. Las posiciones son `"btm"`, `"lft"`, `"rgt"` y `"top"`.
 *
 * @param {Object}
 * - `players` (Player[]): La lista de jugadores en el juego.
 * - `num_players` (number): El número total de jugadores en el juego.
 * - `figcards` (FigCard[]): La lista de cartas de figura que cada jugador posee.
 *
 * @returns {JSX.Element} Tablero de figuras y tableros de jugadores
 */
const MainBoard = ({ players, num_players, figcards }: MainBoardProp) => {
  // Ordena a los jugadores utilizando la función ParsePlayers
  const order = ParsePlayers(players);

  return (
    <>
      <div className="board">
        <div></div>
        <div>
          {/* Renderiza el tablero de la figura para el jugador en la posición "top" si hay más de 2 jugadores */}
          {num_players <= 2 ? (
            ""
          ) : (
            <FigureBoard
              pos="top"
              deck={ParsePlayerFigDeck(order[2].id_jugador, figcards)}
              cards={ParsePlayerFigCards(order[2].id_jugador, figcards)}
              name={order[2].nombre}
            />
          )}
        </div>
        <div></div>

        <div>
          {/* Renderiza el tablero de la figura para el jugador en la posición "lft" si hay más de 1 jugador */}
          {num_players <= 1 ? (
            ""
          ) : (
            <FigureBoard
              pos="lft"
              name={order[1].nombre}
              deck={ParsePlayerFigDeck(order[1].id_jugador, figcards)}
              cards={ParsePlayerFigCards(order[1].id_jugador, figcards)}
            />
          )}
        </div>
        <div>
          {/* Renderiza el tablero principal del juego */}
          <GameBoard />
        </div>
        <div>
          {/* Renderiza el tablero de la figura para el jugador en la posición "rgt" si hay más de 3 jugadores */}
          {num_players <= 3 ? (
            ""
          ) : (
            <FigureBoard
              pos="rgt"
              name={order[3].nombre}
              deck={ParsePlayerFigDeck(order[3].id_jugador, figcards)}
              cards={ParsePlayerFigCards(order[3].id_jugador, figcards)}
            />
          )}
        </div>

        <div></div>
        <div>
          {/* Renderiza el tablero de la figura para el jugador en la posición "btm" siempre */}
          <FigureBoard
            pos="btm"
            name={order[0].nombre}
            deck={ParsePlayerFigDeck(order[0].id_jugador, figcards)}
            cards={ParsePlayerFigCards(order[0].id_jugador, figcards)}
          />
        </div>
        <div></div>
      </div>
    </>
  );
};

export default MainBoard;
