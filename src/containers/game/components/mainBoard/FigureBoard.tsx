import React from "react";
import "./FigureBoard.css";
import FigureCard from "./FigureCard";
import { FigCard } from "../../utils/interfaces";

interface FigureBoardProp {
  pos: string;
  deck: number;
  cards: FigCard[];
  name: string;
}

const FigureBoard = ({ pos, deck, cards, name }: FigureBoardProp) => {
  return (
    <>
      {pos == "btm" && (
        <div className="figureBoard figureGrid ply1">
          <div className="playerName">{name}</div>
          <div className="figureDeck ply1">{deck}</div>
          {cards.map((card) => (
            <FigureCard
              key={card.id_figcard}
              cardID={card.id_figcard}
              type={card.type}
              playerID={card.id_jugador}
            />
          ))}
        </div>
      )}
      {pos == "rgt" && (
        <div className="figureBoardSide figureGridSide ply2">
          {cards.map((card) => (
            <FigureCard
              key={card.id_figcard}
              cardID={card.id_figcard}
              type={card.type}
              playerID={card.id_jugador}
            />
          ))}
          <div className="figureDeck ply2">{deck}</div>
          <div className="playerName">{name}</div>
        </div>
      )}
      {pos == "top" && (
        <div className="figureBoard figureGrid ply3">
          {cards.map((card) => (
            <FigureCard
              key={card.id_figcard}
              cardID={card.id_figcard}
              type={card.type}
              playerID={card.id_jugador}
            />
          ))}
          <div className="figureDeck ply3">{deck}</div>
          <div className="playerName">{name}</div>
        </div>
      )}
      {pos == "lft" && (
        <div className="figureBoardSide figureGridSide ply4">
          <div className="playerName">{name}</div>
          <div className="figureDeck ply4">{deck}</div>
          {cards.map((card) => (
            <FigureCard
              key={card.id_figcard}
              cardID={card.id_figcard}
              type={card.type}
              playerID={card.id_jugador}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default FigureBoard;
