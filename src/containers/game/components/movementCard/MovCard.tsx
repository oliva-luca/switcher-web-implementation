import React from "react";
import "./MovCard.css";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";

interface MovCardProp {
  cardId: number;
  type: number;
}

const MovCard = ({ cardId, type }: MovCardProp) => {
  const { selectedCard, setSelectedCard, playedCards} = useCurrentPlay();
  return (
    <img
      id={cardId.toString()}
      className={playedCards.includes(cardId) ? "used" : "movCard"}
      src={"/mov" + type + ".svg"}
      style={{
        opacity: selectedCard == null || selectedCard[0] == cardId ? 1 : 0.5,
        height: selectedCard != null && selectedCard[0] == cardId ? 200 : 180,
      }}
      onClick={() => {
        if (!playedCards.includes(cardId)) {
          setSelectedCard(
            selectedCard != null && selectedCard[0] == cardId
              ? null
              : [cardId, type]
          );
        }
      }}
      alt="carta de movimiento"
    />
  );
};

export default MovCard;
