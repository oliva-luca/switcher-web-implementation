import React from "react";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";
import "./FigureCard.css";

interface FigureCardProp {
  cardID: number;
  type: number;
  playerID?: number;
}

const FigureCard = ({ cardID, type, playerID }: FigureCardProp) => {
  const {
    selectedFigureCard,
    setSelectedFigureCard,
    setSelectedCard,
    setSelectedTyle,
  } = useCurrentPlay();
  return (
    <img
      id={type.toString()}
      className={"figCard"}
      src={
        type > 18
          ? "/fige0" + (type - 18) + ".svg"
          : type < 10
          ? "/fig0" + type + ".svg"
          : "/fig" + type + ".svg"
      }
      style={{
        opacity: (selectedFigureCard == null || selectedFigureCard[0] == cardID) && playerID != 0
            ? 1
            : 0.5,
        border: selectedFigureCard != null && selectedFigureCard[0] == cardID
            ? "3px solid white"
            : "none",
        borderRadius: "10px",
      }}
      onClick={() => {
          setSelectedTyle(null);
          setSelectedCard(null);
          setSelectedFigureCard(
            selectedFigureCard != null && selectedFigureCard[0] == cardID
              ? null
              : [cardID, type]
          );
      }}
      alt={`${cardID}`}
    />
  );
};

export default FigureCard;


