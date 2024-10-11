import React from "react";
import "./MovCard.css";
import { useSelectedCard } from "../../hooks/SelectedCard.hook";

interface MovCardProp {
  cardId: number;
  type: number;
}

const MovCard = ({ cardId, type }: MovCardProp) => {
  const { selectedCard, setSelectedCard } = useSelectedCard();
  return (
    <img
      id={cardId.toString()}
      className="movCard "
      src={"/mov" + type + ".svg"}
      style={{
        opacity: selectedCard == null || selectedCard[0] == cardId ? 1 : 0.5,
        height: selectedCard != null && selectedCard[0] == cardId ? 200 : 180,
      }}
      onClick={() =>
        setSelectedCard(
          selectedCard != null && selectedCard[0] == cardId
            ? null
            : [cardId, type]
        )
      }
      alt="carta de movimiento"
    />
  );
};

export default MovCard;
