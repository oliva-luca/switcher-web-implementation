import "./GameBoard.css"

type BoardTyleProps = {
  color: string;
  onClick: () => void;
}

const BoardTyle = ({ color, onClick }: BoardTyleProps) =>
    <button className={`boardTyle `+ color} onClick={onClick}></button>

type GameBoardProp = {
  board: string[][];
};

const GameBoard = ({ board }: GameBoardProp) => {

    const handleClick = (row: number, column: number) => console.log(row+","+column);

    return (
      <>
      <div className="square">
        <div className="container text-center board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="column boardColumn" >
              {row.map((cell, cellIndex) => (
                <BoardTyle key={cellIndex} color={cell} 
                onClick={() => handleClick(rowIndex,cellIndex)}/>
              ))}
            </div>
          ))}
        </div>
      </div>
      </>
    );
}

export default GameBoard;