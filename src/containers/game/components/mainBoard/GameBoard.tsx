import "./GameBoard.css";
import ColorTyle from "./ColorTyle";
import { useBoard } from "../../hooks/BoardData.hook";

const GameBoard = () => {
  const { board } = useBoard();

  const handleClick = (row: number, column: number) =>
    console.log(row + "," + column);

  return (
    <>
      {board == null ? (
        "Couldn't load board"
      ) : (
        <div className="boardSquare boardGrid">
          {board?.casillas.map((tyle) => (
            <ColorTyle
              key={tyle.id_casilla}
              color={tyle.color}
              onClick={() => handleClick(tyle.fila, tyle.columna)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GameBoard;
