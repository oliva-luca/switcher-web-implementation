import React from "react";
import "./ColorTyle.css";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";

interface ColorTyleProps {
  tyleId: number;
  col: number;
  row: number;
  color: string;
}

const movMap = new Map<number, [number, number]>();
movMap.set(1, [2, 2]);
movMap.set(2, [2, 0]);
movMap.set(3, [1, 0]);
movMap.set(4, [1, 1]);
movMap.set(5, [2, 1]);
movMap.set(6, [1, 2]);
movMap.set(7, [4, 0]);

const availableMov = (
  cardType: number,
  col: number,
  row: number,
  selectedCol: number,
  selectedRow: number
) => {
  const baseMov = movMap.get(cardType);
  return baseMov == undefined
    ? false
    : (selectedCol + baseMov[0] == col && selectedRow + baseMov[1] == row) ||
        (selectedCol - baseMov[1] == col && selectedRow + baseMov[0] == row) ||
        (selectedCol - baseMov[0] == col && selectedRow - baseMov[1] == row) ||
        (selectedCol + baseMov[1] == col && selectedRow - baseMov[0] == row);
};

const ColorTyle = ({ tyleId, color, col, row }: ColorTyleProps) => {
  const {
    selectedCard,
    setSelectedCard,
    selectedTyle,
    setSelectedTyle,
    currentTurn,
  } = useCurrentPlay();
  const cardType = selectedCard == null ? 0 : selectedCard[1];
  const cardId = selectedCard == null ? 0 : selectedCard[0];

  const handleFinalSelect = () => {
    console.log(
      "card " + cardId + " swaped: " + selectedTyle[2] + "<--->" + tyleId
    );
    setSelectedCard(null);
    setSelectedTyle(null);
  };

  const handleClick = () => {
    if (!currentTurn || currentTurn == Number(localStorage.getItem("userId"))) {
      selectedTyle != null &&
      availableMov(cardType, col, row, selectedTyle[0], selectedTyle[1])
        ? handleFinalSelect()
        : setSelectedTyle(selectedTyle == null ? [col, row, tyleId] : null);
    }
  };

  return (
    <button
      className={`colorTyle ${color} ${
        selectedTyle != null && selectedTyle[2] == tyleId ? "selectedTyle" : ""
      }`}
      onClick={handleClick}
      disabled={
        selectedTyle != null &&
        selectedTyle[2] != tyleId &&
        !availableMov(cardType, col, row, selectedTyle[0], selectedTyle[1])
      }
    >
      {selectedTyle != null && selectedTyle[2] == tyleId ? (
        <div className="squareMarker" />
      ) : selectedTyle != null &&
        availableMov(cardType, col, row, selectedTyle[0], selectedTyle[1]) ? (
        <div className="circleMarker" />
      ) : null}
    </button>
  );
};

export default ColorTyle;
