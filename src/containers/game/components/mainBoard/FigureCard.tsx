import React from "react";

interface FigureCardProp {
  card: number;
}

const FigureCard = ({ card }: FigureCardProp) => {
  const { selectedCard, setSelectedCard } = useCurrentPlay();
  return (
    <img
      className="figCard"
      src={
        card > 18
          ? "/fige0" + (card - 18) + ".svg"
          : card < 10
          ? "/fig0" + card + ".svg"
          : "/fig" + card + ".svg"
      }
      onClick={() =>
        setSelectedCard(
          selectedCard != null && selectedCard[0] == cardId
            ? null
            : [cardId, type]
        )
      }
      alt={`${card}`}
    />
  );
};

export default FigureCard;
