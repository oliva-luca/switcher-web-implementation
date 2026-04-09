import React from "react";
import { render, screen } from "@testing-library/react";
import GameBoard from "../components/mainBoard/GameBoard";
import { useBoard } from "../hooks/BoardData.hook";
import ColorTyle from "../components/mainBoard/ColorTyle";

// Mock de los hooks y componentes
jest.mock("../hooks/BoardData.hook");
jest.mock("../components/mainBoard/ColorTyle", () =>
  jest.fn(() => <div data-testid="color-tyle" />)
);

describe("GameBoard Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render an empty board when the board data is null", () => {
    // Se hace un mock del hook `useBoard` para que retorne un `board` igual a `null`
    (useBoard as jest.Mock).mockReturnValue({ board: null });

    // Renderiza el componente GameBoard
    render(<GameBoard />);

    // Verifica que no se rendericen componentes `ColorTyle` en el DOM
    expect(screen.queryByTestId("color-tyle")).not.toBeInTheDocument();
  });

  it("should render ColorTyle components based on the board data", () => {
    // Se define un conjunto de datos `mockBoard` con tres casillas
    const mockBoard = {
      casillas: [
        { id_casilla: 1, fila: 1, columna: 2, color: "blue", figura: "circle" },
        { id_casilla: 2, fila: 1, columna: 1, color: "red", figura: "square" },
        {
          id_casilla: 3,
          fila: 2,
          columna: 1,
          color: "green",
          figura: "triangle",
        },
      ],
    };

    // Se hace un mock del hook `useBoard` para que retorne el `mockBoard`
    (useBoard as jest.Mock).mockReturnValue({ board: mockBoard });

    // Renderiza el componente GameBoard
    render(<GameBoard />);

    // Verifica que se rendericen tres componentes `ColorTyle` basados en los datos
    const tyleElements = screen.getAllByTestId("color-tyle");
    expect(tyleElements.length).toBe(3);
  });

  it("should render ColorTyle components in sorted order by fila and columna", () => {
    // Se define un conjunto de datos `mockBoard` con casillas desordenadas
    const mockBoard = {
      casillas: [
        {
          id_casilla: 3,
          fila: 2,
          columna: 1,
          color: "green",
          figura: "triangle",
        },
        { id_casilla: 1, fila: 1, columna: 2, color: "blue", figura: "circle" },
        { id_casilla: 2, fila: 1, columna: 1, color: "red", figura: "square" },
      ],
    };

    // Se hace un mock del hook `useBoard` para que retorne el `mockBoard`
    (useBoard as jest.Mock).mockReturnValue({ board: mockBoard });

    // Renderiza el componente GameBoard
    render(<GameBoard />);

    // Verifica que se rendericen tres componentes `ColorTyle`
    const tyleElements = screen.getAllByTestId("color-tyle");
    expect(tyleElements.length).toBe(3);

    // Verifica que los componentes `ColorTyle` se hayan renderizado en el orden correcto
    expect(ColorTyle).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ row: 1, col: 1 }),
      {}
    );
    expect(ColorTyle).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ row: 1, col: 2 }),
      {}
    );
    expect(ColorTyle).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ row: 2, col: 1 }),
      {}
    );
  });
});
