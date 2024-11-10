import React from "react";
import "./ColorTyle.css";
import { useCurrentPlay } from "../../hooks/CurrentPlay.context";
import axios from "axios";

interface ColorTyleProps {
  tyleId: number;
  col: number;
  row: number;
  color: string;
  blocked: boolean;
  tipo_figura: number;
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

const ColorTyle = ({
  tyleId,
  color,
  col,
  row,
  blocked,
  tipo_figura,
}: ColorTyleProps) => {
  const {
    selectedCard,
    setSelectedCard,
    selectedTyle,
    setSelectedTyle,
    currentTurn,
    selectedFigureCard,
    setSelectedFigureCard,
  } = useCurrentPlay();
  const cardType = selectedCard == null ? 0 : selectedCard[1];
  const cardId = selectedCard == null ? 0 : selectedCard[0];

  const handleTyleSwap = async () => {
    try {
      const game_id = sessionStorage.getItem("gameId");
      const casilla_id1 = selectedTyle[2];
      const casilla_id2 = tyleId;

      console.log(
        `Attempting to swap tiles: game_id=${game_id}, cardId=${cardId}, casilla_id1=${casilla_id1}, casilla_id2=${casilla_id2}`
      );

      const response = await axios.put(
        `/gamelist/${game_id}/playcard/${cardId}/casillas/${casilla_id1}/${casilla_id2}`
      );
      console.log("Response:", response);

      setSelectedCard(null);
      setSelectedTyle(null);
    } catch (error) {
      console.error("Error swapping tyles:", error);
    }

    console.log(
      "card " + cardId + " swaped: " + selectedTyle[2] + "<--->" + tyleId
    );
  };

  const handleFigureDiscard = async () => {
    try {
      const game_id = sessionStorage.getItem("gameId");

      const response = await axios.put(
        `/gamelist/${game_id}/discard_figcard/${selectedFigureCard[0]}/color/${color}`
      );
      console.log("Response:", response);

      setSelectedFigureCard(null);
    } catch (error) {
      console.error("Error discarding card:", error);
    }
  };

  const handleFigureBlock = async () => {
    try {
      const game_id = localStorage.getItem("gameId");

      const response = await axios.put(
        `/gamelist/${game_id}/block_figcard/${selectedFigureCard[0]}/color/${color}`
      );
      console.log("Response:", response);

      setSelectedFigureCard(null);
    } catch (error) {
      console.error("Error blocking card:", error);
    }
  };

  const handleClick = () => {
    if (currentTurn == Number(localStorage.getItem("userId"))) {
      //descartar
      selectedTyle == null &&
      selectedCard == null &&
      selectedFigureCard != null &&
      selectedFigureCard[1] == tipo_figura && selectedFigureCard[2]
        ? handleFigureDiscard()
        //bloquear
        : selectedTyle == null &&
          selectedCard == null &&
          selectedFigureCard != null &&
          selectedFigureCard[1] == tipo_figura && !selectedFigureCard[2]
            ? handleFigureBlock()
            //mover fichas
            : selectedTyle != null 
              && selectedCard != null 
              && selectedFigureCard == null 
              && availableMov(cardType, col, row, selectedTyle[0], selectedTyle[1])
              ? handleTyleSwap()
              : setSelectedTyle(selectedTyle == null ? [col, row, tyleId] : null);
    }
  };

  return (
    <div className={tipo_figura != -1 && !blocked ? "resaltado salto" : ""}>
      <button
        className={`colorTyle ${color} ${
          selectedTyle != null && selectedTyle[2] == tyleId
            ? "selectedTyle"
            : ""
        } ${blocked ? "blocked" : ""}`}
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
    </div>
  );
};

export default ColorTyle;
