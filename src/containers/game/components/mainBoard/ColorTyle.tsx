import React from "react";
import "./ColorTyle.css";

interface ColorTyleProps {
  col: number;
  row: number;
  color: string;
  selected: [number, number] | null;
  setSelected: React.Dispatch<React.SetStateAction<[number, number] | null>>;
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
  cardId: number,
  col: number,
  row: number,
  selectedCol: number,
  selectedRow: number
) => {
  const baseMov = movMap.get(cardId);

  return baseMov == undefined
    ? false
    : (selectedCol + baseMov[0] == col && selectedRow + baseMov[1] == row) ||
        (selectedCol - baseMov[1] == col && selectedRow + baseMov[0] == row) ||
        (selectedCol - baseMov[0] == col && selectedRow - baseMov[1] == row) ||
        (selectedCol + baseMov[1] == col && selectedRow - baseMov[0] == row);
};

const ColorTyle = ({
  color,
  col,
  row,
  selected,
  setSelected,
}: ColorTyleProps) => (
  <button
    className={`colorTyle ${color} ${
      selected != null && selected[0] == col && selected[1] == row
        ? "selectedTyle"
        : ""
    }`}
    onClick={() =>
      selected != null && availableMov(1, col, row, selected[0], selected[1])
        ? console.log(col + "," + row)
        : setSelected(selected == null ? [col, row] : null)
    }
    disabled={
      selected != null &&
      (selected[0] != col || selected[1] != row) &&
      !availableMov(1, col, row, selected[0], selected[1])
    }
  >
    {selected != null && selected[0] == col && selected[1] == row ? (
      <div className="squareMarker" />
    ) : selected != null &&
      availableMov(1, col, row, selected[0], selected[1]) ? (
      <div className="circleMarker" />
    ) : null}
  </button>
);

export default ColorTyle;
