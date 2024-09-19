import { MouseEvent } from "react";
import "./GameBoard.css"

function BoardTyle(){
    return (
        <button className="boardTyle">
        </button>
      );
}

function GameBoard(){
    let items = ['ja','jaja','jajaja'];
    //items = [];

    const handleClick = (event: MouseEvent) => console.log(event);

    return (
        <>


        <div className="board">
            <div className="column">
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
            </div>
            <div className="column">
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
            </div>
            <div className="column">
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
            </div>
            <div className="column">
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
            </div>
            <div className="column">
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
            </div>
            <div className="column">
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
                <BoardTyle></BoardTyle>
            </div>
        </div>

        </>
    );
}

export default GameBoard;