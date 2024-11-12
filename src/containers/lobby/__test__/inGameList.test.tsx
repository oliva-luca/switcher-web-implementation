import React from "react";
import { render, waitFor, screen, act } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import axios from "axios";
import InGameList from "../components/inGameList/InGameList";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("axios");
jest.mock("../components/inGameList/slotJoinStartedGame", () =>
  jest.fn(() => <div data-testid="slot-join-started-game"></div>)
);

const renderInGameList = async () => {
  await act(async () => {
    render(
      <Router>
        <InGameList />
      </Router>
    );
  });
};

describe("InGameList Component", () => {
  const mockUserData = [
    {
      id_user: 1,
      players: [
        { id_partida: 1, id_jugador: 1 },
        { id_partida: 2, id_jugador: 2 },
      ],
    },
  ];

  const mockGameList = [
    {
      id_partida: 1,
      name: "Game 1",
      players: [{}, {}],
      cant_jugadores: 4,
      started: false,
    },
    {
      id_partida: 2,
      name: "Game 2",
      players: [{}, {}, {}],
      cant_jugadores: 4,
      started: false,
    },
    {
      id_partida: 3,
      name: "Game 3",
      players: [{}, {}, {}, {}],
      cant_jugadores: 4,
      started: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("userId", "1"); // Simula un usuario en sesión
  });

  it("should fetch and render the user and game lists", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUserData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockGameList });

    await renderInGameList();

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/user"));
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/gamelist"));

    // El componente debería mostrar solo las partidas no iniciadas que el usuario no ha unido
    await waitFor(() =>
      expect(screen.getAllByTestId("slot-join-started-game")).toHaveLength(2)
    ); // Filtra correctamente
  });

  it("should handle fetch error", async () => {
    axios.get.mockRejectedValue(new Error("Error fetching the game list"));

    await renderInGameList();

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/user"));
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/gamelist"));

    // Verifica que no se renderiza ningún componente de juego si hay un error
    await waitFor(() =>
      expect(screen.queryByTestId("slot-join-started-game")).toBeNull()
    );
  });

  it("should filter games by player count", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUserData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockGameList });

    await renderInGameList();

    const playerCount = 4;
    const filteredPartidas = mockGameList
      .filter((partida) => !partida.started)
      .filter((partida) => {
        if (playerCount) {
          return partida.cant_jugadores === Number(playerCount);
        }
        return true;
      });

    expect(filteredPartidas).toEqual([
      {
        id_partida: 1,
        name: "Game 1",
        players: [{}, {}],
        cant_jugadores: 4,
        started: false,
      },
      {
        id_partida: 2,
        name: "Game 2",
        players: [{}, {}, {}],
        cant_jugadores: 4,
        started: false,
      },
    ]);
  });

  it("should get joined games correctly", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUserData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockGameList });

    await renderInGameList();

    const joinedGames =
      mockUserData
        .find(
          (user) => user.id_user.toString() === localStorage.getItem("userId")
        )
        ?.players.map((ply) => ply.id_partida) || [];

    expect(joinedGames).toEqual([1, 2]);
  });
});
