import React from "react";
import "./Game.css";
import QuitBtn from "./components/QuitBtn/QuitBtn";
import PassTurn from "./components/passTurn/passTurn";
import HandOfCards from "./components/movementCard/HandOfCards";
import { useGame } from "./hooks/GameData.hook";
import MainBoard from "./components/mainBoard/MainBoard";
import Timer from "./components/Timer/Timer";
import { CurrentPlayProvider } from "./hooks/CurrentPlay.context";
import CancelMov from "./components/cancelMov/cancelMov";

function Game() {
  const { game, gameInfoKey } = useGame();
  return (
    <>
      {game == null ? (
        ""
      ) : (
        <CurrentPlayProvider>
          <div>
            <MainBoard
              players={game.players}
              num_players={game.players.length}
              figcards={game.figcards}
              key={"board" + gameInfoKey}
            />
            <Timer />
            <PassTurn key={gameInfoKey} />
            <HandOfCards
              cards={game.movcards.filter(
                (card) =>
                  card.id_jugador != null &&
                  card.id_jugador.toString() == sessionStorage.getItem("playerId")
              )}
            />
            <CancelMov />
            <QuitBtn />
          </div>
        </CurrentPlayProvider>
      )}
    </>
  );
}

export default Game;
