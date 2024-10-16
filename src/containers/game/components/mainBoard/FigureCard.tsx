import React from "react";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";
import "./FigureCard.css"; 

interface FigureCardProp {
  cardID:number,
  type: number,
  playerID?: number
}

const FigureCard = ({ cardID, type, playerID = 0 }: FigureCardProp) => {
  const {selectedFigureCard,  setSelectedFigureCard,  playedFigureCard} = useCurrentPlay();
  
  return(
    <img
      id={type.toString()}
      className={playedFigureCard.includes(cardID) ? "used" : "figCard"}
      src={
        type > 18
          ? "/fige0" + (type - 18) + ".svg"
          : type < 10
          ? "/fig0" + type + ".svg"
          : "/fig" + type + ".svg"
      }
      style={{
        opacity:  playerID==0 ? 1:
                  (selectedFigureCard == null || selectedFigureCard[0] == cardID) && playerID != 0 ? 1 : 0.5,
      }}
      onClick={() => {
        if (!playedFigureCard.includes(cardID) && playerID != 0) {
          setSelectedFigureCard(
            selectedFigureCard != null && selectedFigureCard[0] == cardID
              ? null
              : [cardID, type]
          );
        }
      }}
      alt={`${cardID}`}
    />
  );
};

export default FigureCard;
