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

const MainBoard = ({ players, num_players, figcards }: MainBoardProp) => {
  const order = ParsePlayers(players);
  return (
    <>
      <div className="board">
        <div></div>
        <div>
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
          <GameBoard />
        </div>
        <div>
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
