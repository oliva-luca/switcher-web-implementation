import React from "react";
import "./MovCard.css";

interface MovCardProp {
  cardId: number;
  type: number;
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
}

const MovCard = ({ cardId, type, selected, setSelected }: MovCardProp) => {
  return (
    <img
      id={cardId.toString()}
      className="movCard "
      src={"/mov" + type + ".svg"}
      style={{
        opacity: selected == cardId || selected == null ? 1 : 0.5,
        height: selected == cardId && selected != null ? 200 : 180,
      }}
      onClick={() => setSelected(selected == cardId ? null : cardId)}
      alt="carta de movimiento"
    />
  );
};

export default MovCard;
