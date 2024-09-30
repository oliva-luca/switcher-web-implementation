import React from "react";

interface FigureCardProp {
  card: number;
}

const FigureCard = ({ card }: FigureCardProp) => {
  return (
    <img
      src={
        card > 18
          ? "/fige0" + (card - 18) + ".svg"
          : card < 10
          ? "/fig0" + card + ".svg"
          : "/fig" + card + ".svg"
      }
      alt={`${card}`}
    />
  );
};

export default FigureCard;
