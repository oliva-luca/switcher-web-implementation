import "./Game.css";
import QuitBtn from "./components/QuitBtn/QuitBtn";
import PassTurn from "./components/passTurn/passTurn";
import HandOfCards from "./components/movementCard/HandOfCards";
import { useGame } from "./hooks/GameData.hook";
import MainBoard from "./components/mainBoard/MainBoard";
import { useGameInfoKey } from "./hooks/GameInfoKey.hook";

function Game() {
  const game = useGame();
  const gameInfoKey = useGameInfoKey();

  return (
    <>
      {game == null ? (
        ""
      ) : (
        <div>
          <MainBoard
            players={game.players}
            num_players={game.cant_jugadores}
            figcards={game.figcards}
          />
          <PassTurn key={gameInfoKey} />
          <HandOfCards
            cards={game.movcards
              .filter(
                (card) =>
                  card.id_jugador != null &&
                  card.id_jugador.toString() == localStorage.getItem("userId")
              )
              .map((card) => card.type)}
          />
          <QuitBtn />
        </div>
      )}
    </>
  );
}

export default Game;
