import "./Game.css"
import "./Game.css"
import GameBoard from './components/GameBoard'

function Game() {

    const board: string[][] = [
        ["red", "ylw", "grn", "blu", "red", "ylw", "grn"],
        ["blu", "red", "ylw", "grn", "blu", "red", "ylw"],
        ["grn", "blu", "red", "ylw", "grn", "blu", "red"],
        ["ylw", "grn", "blu", "red", "ylw", "grn", "blu"],
        ["red", "ylw", "grn", "blu", "red", "ylw", "grn"],
        ["blu", "red", "ylw", "grn", "blu", "red", "ylw"],
    ];

    return(
        <>
        <div className="game-form"></div>
            <GameBoard board={board}/>
        </>
    )
}

export default Game