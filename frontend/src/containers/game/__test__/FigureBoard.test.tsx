import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FigureBoard from "../components/mainBoard/FigureBoard";
import { FigCard } from "../utils/interfaces";

// Mock de FigureCard para que se renderice un div con el atributo data-testid="figure-card" en lugar del componente real
jest.mock("../components/mainBoard/FigureCard", () => {
  return jest.fn(() => <div data-testid="figure-card"></div>);
});

describe("FigureBoard Component", () => {
  // Datos simulados de cartas de figura
  const mockCards: FigCard[] = [
    {
      id_figcard: 1,
      type: 5,
      id_jugador: 1,
      shown: true,
      id_partida: 0,
    },
    {
      id_figcard: 2,
      type: 3,
      id_jugador: 1,
      shown: true,
      id_partida: 0,
    },
    {
      id_figcard: 3,
      type: 2,
      id_jugador: 1,
      shown: true,
      id_partida: 0,
    },
  ];

  it('should render the FigureBoard component with pos "btm"', () => {
    render(
      <FigureBoard pos="btm" deck={10} cards={mockCards} name="Player 1" />
    );

    // Verifica que el nombre del jugador sea visible en el documento
    expect(screen.getByText("Player 1")).toBeInTheDocument();

    // Verifica que el número de cartas en el mazo sea visible en el documento
    expect(screen.getByText("10")).toBeInTheDocument();

    // Verifica que se hayan renderizado 3 cartas de figura
    expect(screen.getAllByTestId("figure-card").length).toBe(3);
  });

  it('should render the FigureBoard component with pos "rgt"', () => {
    render(
      <FigureBoard pos="rgt" deck={20} cards={mockCards} name="Player 2" />
    );

    // Verifica que el nombre del jugador sea visible en el documento
    expect(screen.getByText("Player 2")).toBeInTheDocument();

    // Verifica que el número de cartas en el mazo sea visible en el documento
    expect(screen.getByText("20")).toBeInTheDocument();

    // Verifica que se hayan renderizado 3 cartas de figura
    expect(screen.getAllByTestId("figure-card").length).toBe(3);
  });

  it('should render the FigureBoard component with pos "top"', () => {
    render(
      <FigureBoard pos="top" deck={30} cards={mockCards} name="Player 3" />
    );

    // Verifica que el nombre del jugador sea visible en el documento
    expect(screen.getByText("Player 3")).toBeInTheDocument();

    // Verifica que el número de cartas en el mazo sea visible en el documento
    expect(screen.getByText("30")).toBeInTheDocument();

    // Verifica que se hayan renderizado 3 cartas de figura
    expect(screen.getAllByTestId("figure-card").length).toBe(3);
  });

  it('should render the FigureBoard component with pos "lft"', () => {
    render(
      <FigureBoard pos="lft" deck={40} cards={mockCards} name="Player 4" />
    );

    // Verifica que el nombre del jugador sea visible en el documento
    expect(screen.getByText("Player 4")).toBeInTheDocument();

    // Verifica que el número de cartas en el mazo sea visible en el documento
    expect(screen.getByText("40")).toBeInTheDocument();

    // Verifica que se hayan renderizado 3 cartas de figura
    expect(screen.getAllByTestId("figure-card").length).toBe(3);
  });
});
