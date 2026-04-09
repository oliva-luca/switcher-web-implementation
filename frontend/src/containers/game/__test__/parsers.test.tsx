import {
  ParsePlayers,
  ParsePlayerFigCards,
  ParsePlayerFigDeck,
} from "../utils/parsers";
import { Player, FigCard } from "../utils/interfaces";

describe("ParsePlayers", () => {
  const players: Player[] = [
    {
      id_jugador: 1,
      block: false,
      id_partida: 1,
      nombre: "Player 1",
      in_game: true,
      position: 3,
    },
    {
      id_jugador: 2,
      block: false,
      id_partida: 1,
      nombre: "Player 2",
      in_game: true,
      position: 1,
    },
    {
      id_jugador: 3,
      block: false,
      id_partida: 1,
      nombre: "Player 3",
      in_game: true,
      position: 2,
    },
  ];

  test("should correctly order players starting with the current user", () => {
    sessionStorage.setItem("playerId", "1");
    const result = ParsePlayers(players);
    expect(result).toEqual([
      {
        id_jugador: 1,
        block: false,
        id_partida: 1,
        nombre: "Player 1",
        in_game: true,
        position: 3,
      },
      {
        id_jugador: 2,
        block: false,
        id_partida: 1,
        nombre: "Player 2",
        in_game: true,
        position: 1,
      },
      {
        id_jugador: 3,
        block: false,
        id_partida: 1,
        nombre: "Player 3",
        in_game: true,
        position: 2,
      },
    ]);
  });

  test("should handle case when current user is not the first player", () => {
    sessionStorage.setItem("playerId", "2");
    const result = ParsePlayers(players);
    expect(result).toEqual([
      {
        id_jugador: 2,
        block: false,
        id_partida: 1,
        nombre: "Player 2",
        in_game: true,
        position: 1,
      },
      {
        id_jugador: 3,
        block: false,
        id_partida: 1,
        nombre: "Player 3",
        in_game: true,
        position: 2,
      },
      {
        id_jugador: 1,
        block: false,
        id_partida: 1,
        nombre: "Player 1",
        in_game: true,
        position: 3,
      },
    ]);
  });
});

describe("ParsePlayerFigCards", () => {
  const figcards: FigCard[] = [
    { id_figcard: 1, type: 1, id_jugador: 1, shown: true, id_partida: 1 },
    { id_figcard: 2, type: 2, id_jugador: 1, shown: false, id_partida: 1 },
    { id_figcard: 3, type: 3, id_jugador: 2, shown: true, id_partida: 1 },
  ];

  test("should return only shown figcards for the specified player", () => {
    const result = ParsePlayerFigCards(1, figcards);
    expect(result).toEqual([
      { id_figcard: 1, type: 1, id_jugador: 1, shown: true, id_partida: 1 },
    ]);
  });

  test("should return an empty array if no cards match the player", () => {
    const result = ParsePlayerFigCards(3, figcards);
    expect(result).toEqual([]);
  });
});

describe("ParsePlayerFigDeck", () => {
  const figcards: FigCard[] = [
    { id_figcard: 1, type: 1, id_jugador: 1, shown: true, id_partida: 1 },
    { id_figcard: 2, type: 2, id_jugador: 1, shown: false, id_partida: 1 },
    { id_figcard: 3, type: 3, id_jugador: 1, shown: false, id_partida: 1 },
    { id_figcard: 4, type: 4, id_jugador: 2, shown: false, id_partida: 1 },
  ];

  test("should return the count of hidden cards for the specified player", () => {
    const result = ParsePlayerFigDeck(1, figcards);
    expect(result).toBe(2);
  });

  test("should return 0 if no hidden cards for the player", () => {
    const result = ParsePlayerFigDeck(2, figcards);
    expect(result).toBe(1);
  });
});
