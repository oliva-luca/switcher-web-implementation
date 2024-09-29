import "./GameBoard.css";

type BoardTyleProps = {
  color: string;
  onClick: () => void;
};

const BoardTyle = ({ color, onClick }: BoardTyleProps) => (
  <button className={`boardTyle ` + color} onClick={onClick}></button>
);

type GameBoardProp = {
  board: string[][];
};

const GameBoard = ({ board }: GameBoardProp) => {
  const handleClick = (row: number, column: number) =>
    console.log(row + "," + column);

  return (
    <>
      <div className="boardSquare boardGrid">
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <BoardTyle
              key={`${rowIndex}-${cellIndex}`}
              color={cell}
              onClick={() => handleClick(rowIndex, cellIndex)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default GameBoard;
