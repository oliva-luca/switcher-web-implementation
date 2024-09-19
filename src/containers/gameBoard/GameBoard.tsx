import { MouseEvent } from "react";
import "./GameBoard.css"
import 'bootstrap/dist/css/bootstrap.css'

function BoardTyle({ color }){
    return (
        <button className={`btn btn-primary boardTyle `+color}>
        </button>
      );
}

function GameBoard(){
    const items: string[][] = [
        ["red","red","red","red","red","red"],
        ["blu","blu","blu","blu","blu","blu"],
        ["grn","grn","grn","grn","grn","grn"],
        ["ylw","ylw","ylw","ylw","ylw","ylw"],
        ["red","red","red","red","red","red"],
        ["red","red","red","red","red","red"]
    ];

    const handleClick = (event: MouseEvent) => console.log(event);

    return (
        <div className="container text-center board">
          {items.map((row, rowIndex) => (
            <div key={rowIndex} className="column boardColumn">
              {row.map((cell, cellIndex) => (
                <BoardTyle key={cellIndex} color={cell} />
              ))}
            </div>
          ))}
        </div>
      );
}

export default GameBoard;