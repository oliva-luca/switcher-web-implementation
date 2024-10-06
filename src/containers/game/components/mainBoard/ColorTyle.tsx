import React from "react";
import "./ColorTyle.css";

interface ColorTyleProps {
  col: number;
  row: number;
  color: string;
  selected: [number, number] | null;
  setSelected: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

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
    onClick={() => setSelected(selected == null ? [col, row] : null)}
    disabled={selected != null && (selected[0] != col || selected[1] != row)}
  >
    {selected != null && selected[0] == col && selected[1] == row ? (
      <div className="squareMarker" />
    ) : (
      ""
    )}
  </button>
);

export default ColorTyle;
