import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import "./Game.css";
import FigureBoard from "./components/mainBoard/FigureBoard";
import GameBoard from "./components/mainBoard/GameBoard";

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

interface Casillas {
  id_casilla: number;
  color: string;
  columna: number;
  fila: number;
  id_tablero: number;
}

interface BoardData {
  color_principal: number;
  id_tablero: number;
  casillas: Casillas[];
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
        (order[i - 1].position == 3 && ply.position == 0)
    );
  }
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
  const [board, setBoard] = useState<BoardData | null>(null);

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

    axios
      .get(`/tableros/${gameId}`)
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  const order = game == null ? [] : ParsePlayers(game?.players);

  return (
    <>
      {game == null || board == null ? (
        <h1>Error creando menu de partida</h1>
      ) : (
        <div className="board">
          <div></div>
          <div>
            <FigureBoard
              pos="top"
              deck={ParsePlayerFigDeck(order[2].id_jugador, game.figcards)}
              cards={ParsePlayerFigCards(order[2].id_jugador, game.figcards)}
            />
          </div>
          <div></div>

          <div>
            <FigureBoard
              pos="lft"
              deck={ParsePlayerFigDeck(order[1].id_jugador, game.figcards)}
              cards={ParsePlayerFigCards(order[1].id_jugador, game.figcards)}
            />
          </div>
          <div>
            <GameBoard board={board.casillas} />
          </div>
          <div>
            <FigureBoard
              pos="rgt"
              deck={ParsePlayerFigDeck(order[3].id_jugador, game.figcards)}
              cards={ParsePlayerFigCards(order[3].id_jugador, game.figcards)}
            />
          </div>

          <div></div>
          <div>
            <FigureBoard
              pos="btm"
              deck={ParsePlayerFigDeck(order[0].id_jugador, game.figcards)}
              cards={ParsePlayerFigCards(order[0].id_jugador, game.figcards)}
            />
          </div>
          <div></div>
        </div>
      )}
    </>
  );
}

export default Game;
