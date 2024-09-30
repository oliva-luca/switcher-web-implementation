import React from "react";
import "./Game.css";
import FigureBoard from "./components/mainBoard/FigureBoard";
import GameBoard from "./components/mainBoard/GameBoard";

function Game() {
  const board: string[][] = [
    ["red", "ylw", "grn", "blu", "red", "ylw"],
    ["blu", "red", "ylw", "grn", "blu", "red"],
    ["grn", "blu", "red", "ylw", "grn", "blu"],
    ["ylw", "grn", "blu", "red", "ylw", "grn"],
    ["red", "ylw", "grn", "blu", "red", "ylw"],
    ["blu", "red", "ylw", "grn", "blu", ""],
  ];

  return (
    <>
      <div className="board">
        <div></div>
        <div>
          <FigureBoard pos="top" deck={0} />
        </div>
        <div></div>

        <div>
          <FigureBoard pos="lft" deck={0} />
        </div>
        <div>
          <GameBoard board={board} />
        </div>
        <div>
          <FigureBoard pos="rgt" deck={0} />
        </div>

        <div></div>
        <div>
          <FigureBoard pos="btm" deck={0} />
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Game;
