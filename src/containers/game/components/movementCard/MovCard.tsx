import React from "react";
import "./MovCard.css";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";

interface MovCardProp {
  cardId: number;
  type: number;
  state: boolean;
}

const MovCard = ({ cardId, type, state }: MovCardProp) => {
  const { selectedCard, setSelectedCard, setSelectedFigureCard } =
    useCurrentPlay();
  return (
    <img
      id={cardId.toString()}
      className={state ? "used" : "movCard"}
      src={"/mov" + type + ".svg"}
      style={{
        opacity: selectedCard == null || selectedCard[0] == cardId ? 1 : 0.5,
        height: selectedCard != null && selectedCard[0] == cardId ? 200 : 180,
      }}
      onClick={() => {
        if (!state) {
          setSelectedFigureCard(null);
          setSelectedCard(
            selectedCard != null && selectedCard[0] == cardId
              ? null
              : [cardId, type]
          );
        }
      }}
    />
  );
};

export default MovCard;
