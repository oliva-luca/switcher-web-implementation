import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import FigureCard from "../components/mainBoard/FigureCard";
import { useCurrentPlay } from "../hooks/CurrentPlay.context";
import axios from "axios";

// Mock del hook useCurrentPlay y las solicitudes HTTP de axios
jest.mock("axios");
jest.mock("../hooks/CurrentPlay.context", () => ({
  useCurrentPlay: jest.fn(),
}));

describe("Componente FigureCard", () => {
  const setSelectedTyle = jest.fn();
  const setSelectedCard = jest.fn();
  const setSelectedFigureCard = jest.fn();

  // Props por defecto para el componente FigureCard
  const defaultProps = {
    cardID: 0,
    type: 2,
    playerID: 1,
  };

  beforeEach(() => {
    // Configura valores mock por defecto para el hook useCurrentPlay
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedFigureCard: null,
      setSelectedFigureCard,
      setSelectedCard,
      setSelectedTyle,
    });
    sessionStorage.setItem("gameId", "1");
    sessionStorage.setItem("playerId", "1");
  });

  afterEach(() => {
    // Limpia los mocks y el session storage después de cada test
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("debería renderizar la FigureCard", () => {
    // Renderiza FigureCard y verifica si la imagen tiene la clase figCard
    const { container } = render(<FigureCard {...defaultProps} />);
    const img = container.querySelector(".figCard");
    expect(img).toHaveClass("figCard");
  });

  it("debería llamar a setSelected con los parámetros correctos al hacer clic", () => {
    // Renderiza FigureCard y simula un evento de clic
    const { getByRole } = render(<FigureCard {...defaultProps} />);
    const img = getByRole("img");

    fireEvent.click(img);
    // Verifica que setSelectedFigureCard se llama con los parámetros correctos
    expect(setSelectedFigureCard).toHaveBeenCalledWith([0, 2, true]);
  });

  it("debería deshabilitar la imagen cuando otra casilla está seleccionada", () => {
    // Mock de selectedFigureCard para simular una tarjeta ya seleccionada
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedFigureCard: [1, 2],
      setSelectedFigureCard,
      setSelectedCard,
      setSelectedTyle,
    });

    // Renderiza FigureCard y verifica si la opacidad de la imagen indica que está deshabilitada
    const { getByRole } = render(<FigureCard {...defaultProps} />);
    const img = getByRole("img");
    const style = window.getComputedStyle(img);
    expect(style.opacity).toBe("0.5");
  });
});
