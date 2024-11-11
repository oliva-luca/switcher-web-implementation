import React from "react";
import "./Game.css";
import QuitBtn from "./components/QuitBtn/QuitBtn";
import LobbyBtn from "./components/lobbyBtn/LobbyBtn";
import PassTurn from "./components/passTurn/passTurn";
import HandOfCards from "./components/movementCard/HandOfCards";
import { useGame } from "./hooks/GameData.hook";
import MainBoard from "./components/mainBoard/MainBoard";
import Timer from "./components/Timer/Timer";
import { CurrentPlayProvider } from "./hooks/CurrentPlay.context";
import CancelMov from "./components/cancelMov/cancelMov";
import Chat from "./components/chat/chat";
import Log from "./components/log/Log";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Game() {
  const { game, gameInfoKey } = useGame();
  const navigate = useNavigate();

  if (
    sessionStorage.getItem("gameId") == null ||
    sessionStorage.getItem("playerId") == null
  ) {
    Swal.fire({
      text: "Error cargando datos de la partida",
      confirmButtonText: "Volver al lobby",
    }).then(() => {
      sessionStorage.clear();
      navigate("/lobby");
    });
  }

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
                  card.id_jugador.toString() ==
                    sessionStorage.getItem("playerId")
              )}
            />
            <Chat />
            <CancelMov />
            <Log />
            <QuitBtn />
            <LobbyBtn />
          </div>
        </CurrentPlayProvider>
      )}
    </>
  );
}

export default Game;
