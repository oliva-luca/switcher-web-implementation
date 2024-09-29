import "./Game.css";
import "./Game.css";
import GameBoard from "./components/GameBoard";

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
        <div className="square-cor">00</div>
        <div className="square-side2">01</div>
        <div className="square-cor">02</div>

        <div className="square-side">10</div>
        <div>
          <GameBoard board={board} />
        </div>
        <div className="square-side">12</div>

        <div className="square-cor">20</div>
        <div className="square-side2">21</div>
        <div className="square-cor">22</div>
      </div>
    </>
  );
}

export default Game;
