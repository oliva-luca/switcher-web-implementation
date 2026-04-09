import React from "react";
import { render, screen } from "@testing-library/react";
import MainBoard from "../components/mainBoard/MainBoard";
import {
  ParsePlayers,
  ParsePlayerFigDeck,
  ParsePlayerFigCards,
} from "../utils/parsers";
import GameBoard from "../components/mainBoard/GameBoard";
import FigureBoard from "../components/mainBoard/FigureBoard";

// Mocks de funciones y componentes
jest.mock("../utils/parsers");
jest.mock("../components/mainBoard/GameBoard");
jest.mock("../components/mainBoard/FigureBoard", () =>
  jest.fn(() => <div data-testid="figure-board" />)
);

describe("Componente MainBoard", () => {
  // Datos simulados de jugadores y cartas
  const mockPlayers = [
    { id_jugador: 1, nombre: "Player 1" },
    { id_jugador: 2, nombre: "Player 2" },
    { id_jugador: 3, nombre: "Player 3" },
    { id_jugador: 4, nombre: "Player 4" },
  ];
  const mockFigcards = [{ id_figura: 1, name: "Card 1" }];

  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();

    // Definir comportamientos esperados de las funciones mockeadas
    (ParsePlayers as jest.Mock).mockReturnValue(mockPlayers);
    (ParsePlayerFigDeck as jest.Mock).mockImplementation(
      (id) => `Deck for player ${id}`
    );
    (ParsePlayerFigCards as jest.Mock).mockImplementation(
      (id) => `Cards for player ${id}`
    );
  });

  it("renderiza GameBoard y FigureBoards correctamente para 4 jugadores", () => {
    render(
      <MainBoard
        players={mockPlayers}
        num_players={4}
        figcards={mockFigcards}
      />
    );

    // Verificar que el componente GameBoard se haya llamado
    expect(GameBoard).toHaveBeenCalled();

    // Verificar que se rendericen 4 FigureBoards
    const figureBoards = screen.getAllByTestId("figure-board");
    expect(figureBoards.length).toBe(4);

    // Verificar que cada FigureBoard tiene las propiedades correctas
    expect(FigureBoard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ pos: "top", name: "Player 3" }),
      {}
    );
    expect(FigureBoard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ pos: "lft", name: "Player 2" }),
      {}
    );
    expect(FigureBoard).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ pos: "rgt", name: "Player 4" }),
      {}
    );
    expect(FigureBoard).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({ pos: "btm", name: "Player 1" }),
      {}
    );
  });

  it("renderiza solo 3 FigureBoards correctamente para 3 jugadores", () => {
    render(
      <MainBoard
        players={mockPlayers}
        num_players={3}
        figcards={mockFigcards}
      />
    );

    // Verificar que el componente GameBoard se haya llamado
    expect(GameBoard).toHaveBeenCalled();

    // Verificar que se rendericen 3 FigureBoards
    const figureBoards = screen.getAllByTestId("figure-board");
    expect(figureBoards.length).toBe(3);

    // Verificar que cada FigureBoard tiene las propiedades correctas
    expect(FigureBoard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ pos: "top", name: "Player 3" }),
      {}
    );
    expect(FigureBoard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ pos: "lft", name: "Player 2" }),
      {}
    );
    expect(FigureBoard).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ pos: "btm", name: "Player 1" }),
      {}
    );
  });

  it("renderiza solo 2 FigureBoards correctamente para 2 jugadores", () => {
    render(
      <MainBoard
        players={mockPlayers}
        num_players={2}
        figcards={mockFigcards}
      />
    );

    // Verificar que el componente GameBoard se haya llamado
    expect(GameBoard).toHaveBeenCalled();

    // Verificar que se rendericen 2 FigureBoards
    const figureBoards = screen.getAllByTestId("figure-board");
    expect(figureBoards.length).toBe(2);

    // Verificar que cada FigureBoard tiene las propiedades correctas
    expect(FigureBoard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ pos: "lft", name: "Player 2" }),
      {}
    );
    expect(FigureBoard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ pos: "btm", name: "Player 1" }),
      {}
    );
  });
});
