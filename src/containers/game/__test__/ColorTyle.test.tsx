import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import ColorTyle from "../components/mainBoard/ColorTyle";
import { useCurrentPlay } from "../hooks/CurrentPlay.context";
import axios from "axios";

// Mock del hook useCurrentPlay y las solicitudes HTTP de axios
jest.mock("axios");
jest.mock("../hooks/CurrentPlay.context", () => ({
  useCurrentPlay: jest.fn(),
}));

describe("Componente ColorTyle", () => {
  const setSelectedTyle = jest.fn();
  const setSelectedCard = jest.fn();

  // Props por defecto para el componente ColorTyle
  const defaultProps = {
    tyleId: 1,
    col: 0,
    row: 0,
    color: "rojo",
    tipo_figura: 1,
  };

  beforeEach(() => {
    // Configura valores mock por defecto para el hook useCurrentPlay
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: null,
      setSelectedTyle,
      setSelectedCard,
      selectedCard: null,
      currentTurn: 1,
    });

    // Valores de sessionStorage para tests
    sessionStorage.setItem("gameId", "1");
    sessionStorage.setItem("playerId", "1");
  });

  afterEach(() => {
    // Limpia los mocks y el session storage después de cada test
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("debería renderizar ColorTyle con la clase de color correcta", () => {
    // Renderiza ColorTyle y verifica si el botón tiene la clase de color correcta
    const { container } = render(<ColorTyle {...defaultProps} />);
    const button = container.querySelector(".colorTyle");
    expect(button).toHaveClass("colorTyle rojo");
  });

  it("debería llamar a setSelected con los parámetros correctos al hacer clic", () => {
    // Renderiza ColorTyle y simula un evento de clic
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");

    fireEvent.click(button);
    // Verifica que setSelectedTyle se llame con los parámetros correctos
    expect(setSelectedTyle).toHaveBeenCalledWith([0, 0, 1]);
  });

  it("debería aplicar la clase selectedTyle cuando la casilla está seleccionada", () => {
    // Mock de selectedTyle para simular una casilla seleccionada
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [0, 0, 1],
      setSelectedTyle,
      setSelectedCard,
      selectedCard: null,
      currentTurn: 1,
    });
    sessionStorage.setItem("playerId", "1");

    // Renderiza ColorTyle y verifica si la clase selectedTyle se aplica
    const { container } = render(<ColorTyle {...defaultProps} />);
    const button = container.querySelector(".colorTyle");
    expect(button).toHaveClass("selectedTyle");
  });

  it("debería deshabilitar el botón cuando otra casilla está seleccionada", () => {
    // Mock de selectedTyle para simular una casilla diferente seleccionada
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [1, 1, 2],
      setSelectedTyle,
      setSelectedCard,
      selectedCard: null,
      currentTurn: 1,
    });

    // Renderiza ColorTyle y verifica si el botón está deshabilitado
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");
    expect(button).toBeDisabled();
  });

  it("debería mostrar el marcador cuadrado cuando está seleccionada", () => {
    // Mock de selectedTyle para simular una casilla seleccionada
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [0, 0, 1],
      setSelectedTyle,
      setSelectedCard,
      selectedCard: [0, 3],
      currentTurn: 1,
    });

    // Renderiza ColorTyle y verifica si el marcador cuadrado está visible
    const { container } = render(<ColorTyle {...defaultProps} />);
    const marker = container.querySelector(".squareMarker");
    expect(marker).toBeInTheDocument();
  });

  it("debería mostrar el marcador circular cuando está disponible para moverse", () => {
    // Mock de selectedTyle para simular una casilla seleccionable para movimiento
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [0, 1, 2],
      setSelectedTyle,
      setSelectedCard,
      selectedCard: [0, 3],
      currentTurn: 1,
    });

    // Renderiza ColorTyle y verifica si el marcador circular está visible
    const { container } = render(<ColorTyle {...defaultProps} />);
    const marker = container.querySelector(".circleMarker");
    expect(marker).toBeInTheDocument();
  });

  it("debería llamar a la solicitud HTTP para jugar carta", () => {
    // Mock de selectedTyle y selectedCard para el escenario de jugar carta
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [0, 1, 2],
      setSelectedTyle,
      setSelectedCard,
      selectedCard: [0, 3],
      selectedFigureCard: null,
      currentTurn: 1,
    });
    const axiosPutMock = axios.put as jest.MockedFunction<typeof axios.put>;
    axiosPutMock.mockResolvedValueOnce({ data: {} });

    // Renderiza ColorTyle y simula un evento de clic para jugar carta
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");
    fireEvent.click(button);

    // Verifica que axios.put fue llamado con la URL correcta
    expect(axios.put).toHaveBeenCalledWith(
      "/gamelist/1/playcard/0/casillas/2/1"
    );
  });

  it("debería llamar a la solicitud HTTP para descartar figcard", () => {
    // Mock de selectedFigureCard para simular el descarte de una figcard
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: null,
      setSelectedTyle,
      setSelectedCard,
      selectedCard: null,
      selectedFigureCard: [3, 1, true],
      currentTurn: 1,
    });
    const axiosPutMock = axios.put as jest.MockedFunction<typeof axios.put>;
    axiosPutMock.mockResolvedValueOnce({ data: {} });

    // Renderiza ColorTyle y simula un evento de clic para descartar figcard
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");
    fireEvent.click(button);

    // Verifica que axios.put fue llamado con la URL correcta para descartar
    expect(axios.put).toHaveBeenCalledWith(
      "/gamelist/1/discard_figcard/3/color/rojo"
    );
  });

  it("debería llamar a la solicitud HTTP para bloquear figcard", () => {
    // Mock de selectedFigureCard para simular el bloqueo de una figcard
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: null,
      setSelectedTyle,
      setSelectedCard,
      selectedCard: null,
      selectedFigureCard: [3, 1, false],
      currentTurn: 1,
    });
    const axiosPutMock = axios.put as jest.MockedFunction<typeof axios.put>;
    axiosPutMock.mockResolvedValueOnce({ data: {} });

    // Renderiza ColorTyle y simula un evento de clic para bloquear figcard
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");
    fireEvent.click(button);

    // Verifica que axios.put fue llamado con la URL correcta para bloquear
    expect(axios.put).toHaveBeenCalledWith(
      "/gamelist/1/block_figcard/3/color/rojo"
    );
  });
});
