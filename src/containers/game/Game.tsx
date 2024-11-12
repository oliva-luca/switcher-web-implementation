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
  const navigate = useNavigate();

  if (
    sessionStorage.getItem("gameId") == null ||
    sessionStorage.getItem("playerId") == null
  ) {
    Swal.fire({
      text: "Error cargando datos de la partida",
      confirmButtonText: "Volver al lobby",
    }).finally(() => {
      sessionStorage.clear();
      navigate("/lobby");
    });
  }

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
            <div className="r-items-container" style={{ zIndex: 1 }}>
              <Timer />
              <PassTurn key={gameInfoKey} />
              <Chat />
              <Log />
            </div>
            <HandOfCards
              cards={game.movcards.filter(
                (card) =>
                  card.id_jugador != null &&
                  card.id_jugador.toString() ==
                    sessionStorage.getItem("playerId")
              )}
            />
            <CancelMov />
            <QuitBtn />
            <LobbyBtn />
          </div>
        </CurrentPlayProvider>
      )}
    </>
  );
}

export default Game;
