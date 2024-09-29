import "./Game.css";
import "./Game.css";
import GameBoard from "./components/GameBoard";
import FigureBoard from "./components/FigureBoard";

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
          <FigureBoard pos="top" deck={3} />
        </div>
        <div></div>

        <div>
          <FigureBoard pos="lft" deck={3} />
        </div>
        <div>
          <GameBoard board={board} />
        </div>
        <div>
          <FigureBoard pos="rgt" deck={3} />
        </div>

        <div></div>
        <div>
          <FigureBoard pos="btm" deck={3} />
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Game;
