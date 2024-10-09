import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "./Game.css";
import FigureBoard from "./components/mainBoard/FigureBoard";
import GameBoard from "./components/mainBoard/GameBoard";
import QuitBtn from "./components/QuitBtn/QuitBtn";
import PassTurn from "./components/passTurn/passTurn";
import HandOfCards from "./components/movementCard/HandOfCards";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Timer from './components/Timer/Timer';

interface Player {
  id_jugador: number;
  block: boolean;
  id_partida: number;
  nombre: string;
  in_game: boolean;
  position: number;
}

interface MovCard {
  id_partida: number;
  type: number;
  id_movcard: number;
  id_jugador: number;
}

interface FigCard {
  type: number;
  show: boolean;
  id_jugador: number;
  id_figcard: number;
  id_partida: number;
}

interface GameData {
  id_partida: number;
  name: string;
  started: boolean;
  password: string;
  owner: string;
  cant_jugadores: number;
  is_private: boolean;
  turn: number;
  id_tablero: number;
  players: Player[];
  movcards: MovCard[];
  figcards: FigCard[];
}

function ParsePlayers(players: Player[]) {
  var order = new Array(players.length);
  order[0] = players.find(
    (ply) => ply.id_jugador.toString() == localStorage.getItem("userId")
  );
  for (let i = 1; i < players.length; i++) {
    order[i] = players.find(
      (ply) =>
        ply.position == order[i - 1].position + 1 ||
        (order[i - 1].position == players.length - 1 && ply.position == 0)
    );
  }
  console.log(order);
  return order;
}

function ParsePlayerFigCards(plyId: number, figcards: FigCard[]) {
  return figcards
    .filter((fig) => fig.id_jugador == plyId)
    .map((fig) => fig.type);
}

function ParsePlayerFigDeck(plyId: number, figcards: FigCard[]) {
  return (
    figcards.filter((fig) => !fig.show && fig.id_jugador == plyId).length - 3
  );
}

function Game() {
  const [game, setGame] = useState<GameData | null>(null);
  const [gameInfoKey, setGameInfoKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");
    const socket = new WebSocket(`ws://localhost:8000/ws/game/${gameId}`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received");
      setGameInfoKey((prevKey) => prevKey + 1); // Update key to force re-render
      const message = event.data;
      switch (message) {
        case "winner":
          Swal.fire({
            title: "¡Ganaste!",
            text: "Felicidades, has ganado la partida.",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          navigate("/lobby");
          break;

        default:
          // alert("Actualizar info partida");
          console.log(message);
          break;
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");

    axios
      .get(`/gamelist/${gameId}`)
      .then((response) => {
        setGame(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  const order = game == null ? [] : ParsePlayers(game?.players);

  return (
    <>
      {game == null ? (
        <h1>Error creando menu de partida</h1>
      ) : (
        <div className="board">
          <div></div>
          <div>
            {game.cant_jugadores <= 2 ? (
              ""
            ) : (
              <FigureBoard
                pos="top"
                name={order[2].nombre}
                deck={ParsePlayerFigDeck(order[2].id_jugador, game.figcards)}
                cards={ParsePlayerFigCards(order[2].id_jugador, game.figcards)}
              />
            )}
          </div>
          <div></div>

          <div>
            {game.cant_jugadores <= 1 ? (
              ""
            ) : (
              <FigureBoard
                pos="lft"
                name={order[1].nombre}
                deck={ParsePlayerFigDeck(order[1].id_jugador, game.figcards)}
                cards={ParsePlayerFigCards(order[1].id_jugador, game.figcards)}
              />
            )}
          </div>
          <div>
            <GameBoard />
          </div>
          <div>
            {game.cant_jugadores <= 3 ? (
              ""
            ) : (
              <FigureBoard
                pos="rgt"
                name={order[3].nombre}
                deck={ParsePlayerFigDeck(order[3].id_jugador, game.figcards)}
                cards={ParsePlayerFigCards(order[3].id_jugador, game.figcards)}
              />
            )}
          </div>

          <div></div>
          <div>
            <FigureBoard
              pos="btm"
              name={order[0].nombre}
              deck={ParsePlayerFigDeck(order[0].id_jugador, game.figcards)}
              cards={ParsePlayerFigCards(order[0].id_jugador, game.figcards)}
            />
          </div>
          <div></div>
        </div>
      )}
      {game == null ? (
        ""
      ) : (
        <div>
          <Timer/>
          <PassTurn key={gameInfoKey} />
          <></>
          <HandOfCards
            cards={game.movcards
              .filter(
                (card) =>
                  card.id_jugador != null &&
                  card.id_jugador.toString() == localStorage.getItem("userId")
              )
              .map((card) => card.type)}
          />
          <></>
          <QuitBtn />
        </div>
      )}
    </>
  );
}

export default Game;
