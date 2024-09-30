import "./GameBoard.css";

interface Casillas {
  id_casilla: number;
  color: string;
  columna: number;
  fila: number;
  id_tablero: number;
}

interface GameBoardProp {
  board: Casillas[];
}

interface BoardTyleProps {
  color: string;
  onClick: () => void;
}

const BoardTyle = ({ color, onClick }: BoardTyleProps) => (
  <button className={`boardTyle ` + color} onClick={onClick}></button>
);

const GameBoard = ({ board }: GameBoardProp) => {
  const handleClick = (row: number, column: number) =>
    console.log(row + "," + column);

  return (
    <>
      <div className="boardSquare boardGrid">
        {board.map((tyle) => (
          <BoardTyle
            key={tyle.id_casilla}
            color={tyle.color}
            onClick={() => handleClick(tyle.fila, tyle.columna)}
          />
        ))}
      </div>
    </>
  );
};

export default GameBoard;
