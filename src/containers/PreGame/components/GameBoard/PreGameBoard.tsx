import "./PreGameBoard.css"

type BoardTyleProps = {
  color: string;
  onClick: () => void;
}

const BoardTyle = ({ color, onClick }: BoardTyleProps) =>
    <button className={`boardTyle-cm `+ color} onClick={onClick}></button>

type GameBoardProp = {
  board: string[][];
};

const PreGameBoard = ({ board }: GameBoardProp) => {

    const handleClick = (row: number, column: number) => console.log(row+","+column);

    return (
      <>
        <div className="square-cm">
          <div className="container text-center board-cm">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="column boardColumn-cm" >
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

export default PreGameBoard;