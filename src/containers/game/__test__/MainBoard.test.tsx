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

jest.mock("../utils/parsers");
jest.mock("../components/mainBoard/GameBoard");
jest.mock("../components/mainBoard/FigureBoard", () =>
  jest.fn(() => <div data-testid="figure-board" />)
);

describe("MainBoard Component", () => {
  const mockPlayers = [
    { id_jugador: 1, nombre: "Player 1" },
    { id_jugador: 2, nombre: "Player 2" },
    { id_jugador: 3, nombre: "Player 3" },
    { id_jugador: 4, nombre: "Player 4" },
  ];
  const mockFigcards = [{ id_figura: 1, name: "Card 1" }];

  beforeEach(() => {
    jest.clearAllMocks();

    (ParsePlayers as jest.Mock).mockReturnValue(mockPlayers);
    (ParsePlayerFigDeck as jest.Mock).mockImplementation(
      (id) => `Deck for player ${id}`
    );
    (ParsePlayerFigCards as jest.Mock).mockImplementation(
      (id) => `Cards for player ${id}`
    );
  });

  it("renders GameBoard and FigureBoards correctly for 4 players", () => {
    render(
      <MainBoard
        players={mockPlayers}
        num_players={4}
        figcards={mockFigcards}
      />
    );

    expect(GameBoard).toHaveBeenCalled();
    const figureBoards = screen.getAllByTestId("figure-board");
    expect(figureBoards.length).toBe(4);
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

  it("renders only 3 FigureBoards correctly for 3 players", () => {
    render(
      <MainBoard
        players={mockPlayers}
        num_players={3}
        figcards={mockFigcards}
      />
    );

    expect(GameBoard).toHaveBeenCalled();
    const figureBoards = screen.getAllByTestId("figure-board");
    expect(figureBoards.length).toBe(3);
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

  it("renders only 2 FigureBoards correctly for 2 players", () => {
    render(
      <MainBoard
        players={mockPlayers}
        num_players={2}
        figcards={mockFigcards}
      />
    );

    expect(GameBoard).toHaveBeenCalled();
    const figureBoards = screen.getAllByTestId("figure-board");
    expect(figureBoards.length).toBe(2);
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
