import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import ColorTyle from "../components/mainBoard/ColorTyle";
import { useCurrentPlay } from "../hooks/CurrentPlay.context";
import axios from "axios";

// Mock the useCurrentPlay hook
jest.mock("axios");
jest.mock("../hooks/CurrentPlay.context", () => ({
  useCurrentPlay: jest.fn(),
}));

describe("ColorTyle Component", () => {
  const setSelectedTyle = jest.fn();
  const setSelectedCard = jest.fn();

  const defaultProps = {
    tyleId: 1,
    col: 0,
    row: 0,
    color: "rojo",
    tipo_figura: 1,
  };

  beforeEach(() => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: null,
      setSelectedTyle: setSelectedTyle,
      setSelectedCard: setSelectedCard,
      selectedCard: null,
      currentTurn: 1,
    });
    sessionStorage.setItem("gameId", "1");
    sessionStorage.setItem("playerId", "1");
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("should renders ColorTyle with the correct color class", () => {
    const { container } = render(<ColorTyle {...defaultProps} />);
    const button = container.querySelector(".colorTyle");
    expect(button).toHaveClass("colorTyle rojo");
  });

  it("should call setSelected with correct parameters on click", () => {
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");

    fireEvent.click(button);
    expect(setSelectedTyle).toHaveBeenCalledWith([0, 0, 1]);
  });

  it("should apply the selectedTyle class when the tile is selected", () => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [0, 0, 1],
      setSelectedTyle: setSelectedTyle,
      setSelectedCard: setSelectedCard,
      selectedCard: null,
      currentTurn: 1,
    });
    sessionStorage.setItem("playerId", "1");
    const { container } = render(<ColorTyle {...defaultProps} />);
    const button = container.querySelector(".colorTyle");
    expect(button).toHaveClass("selectedTyle");
  });

  it("should disable the button when another tile is selected", () => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [1, 1, 2],
      setSelectedTyle: setSelectedTyle,
      setSelectedCard: setSelectedCard,
      selectedCard: null,
      currentTurn: 1,
    });
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should show the square marker when selected", () => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [0, 0, 1],
      setSelectedTyle: setSelectedTyle,
      setSelectedCard: setSelectedCard,
      selectedCard: [0, 3],
      currentTurn: 1,
    });
    const { container } = render(<ColorTyle {...defaultProps} />);
    const marker = container.querySelector(".squareMarker");
    expect(marker).toBeInTheDocument();
  });

  it("should show the circle marker when available to move", () => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [0, 1, 2],
      setSelectedTyle: setSelectedTyle,
      setSelectedCard: setSelectedCard,
      selectedCard: [0, 3],
      currentTurn: 1,
    });
    const { container } = render(<ColorTyle {...defaultProps} />);
    const marker = container.querySelector(".circleMarker");
    expect(marker).toBeInTheDocument();
  });

  it("should show the circle marker when available to move", () => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: [0, 1, 2],
      setSelectedTyle: setSelectedTyle,
      setSelectedCard: setSelectedCard,
      selectedCard: [0, 3],
      selectedFigureCard: null,
      currentTurn: 1,
    });
    const axiosPutMock = axios.put as jest.MockedFunction<typeof axios.put>;
    axiosPutMock.mockResolvedValueOnce({ data: {} });
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");
    fireEvent.click(button);

    expect(axios.put).toHaveBeenCalledWith(
      "/gamelist/1/playcard/0/casillas/2/1"
    );
  });

  it("should show the circle marker when available to move", () => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedTyle: null,
      setSelectedTyle: setSelectedTyle,
      setSelectedCard: setSelectedCard,
      selectedCard: null,
      selectedFigureCard: [3, 1],
      currentTurn: 1,
    });
    const axiosPutMock = axios.put as jest.MockedFunction<typeof axios.put>;
    axiosPutMock.mockResolvedValueOnce({ data: {} });
    const { getByRole } = render(<ColorTyle {...defaultProps} />);
    const button = getByRole("button");
    fireEvent.click(button);

    expect(axios.put).toHaveBeenCalledWith(
      "/gamelist/1/discard_figcard/3/color/rojo"
    );
  });
});
