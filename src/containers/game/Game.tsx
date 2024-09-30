<<<<<<< HEAD
import "./Game.css";
import "./Game.css";
import GameBoard from "./components/GameBoard";
import FigureBoard from "./components/FigureBoard";
=======
import React from "react";
import "./Game.css";
import FigureBoard from "./components/mainBoard/FigureBoard";
import GameBoard from "./components/mainBoard/GameBoard";
>>>>>>> 2ba7d57c095e4830d2778fbe1254bdb44c7b7b20

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
<<<<<<< HEAD
          <FigureBoard pos="top" deck={3} />
=======
          <FigureBoard pos="top" deck={0} />
>>>>>>> 2ba7d57c095e4830d2778fbe1254bdb44c7b7b20
        </div>
        <div></div>

        <div>
<<<<<<< HEAD
          <FigureBoard pos="lft" deck={3} />
=======
          <FigureBoard pos="lft" deck={0} />
>>>>>>> 2ba7d57c095e4830d2778fbe1254bdb44c7b7b20
        </div>
        <div>
          <GameBoard board={board} />
        </div>
        <div>
<<<<<<< HEAD
          <FigureBoard pos="rgt" deck={3} />
=======
          <FigureBoard pos="rgt" deck={0} />
>>>>>>> 2ba7d57c095e4830d2778fbe1254bdb44c7b7b20
        </div>

        <div></div>
        <div>
<<<<<<< HEAD
          <FigureBoard pos="btm" deck={3} />
=======
          <FigureBoard pos="btm" deck={0} />
>>>>>>> 2ba7d57c095e4830d2778fbe1254bdb44c7b7b20
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Game;
