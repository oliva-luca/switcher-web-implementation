import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import FigureCard from "../components/mainBoard/FigureCard";
import { useCurrentPlay } from "../hooks/CurrentPlay.context";
import axios from "axios";

jest.mock("axios");
jest.mock("../hooks/CurrentPlay.context", () => ({
  useCurrentPlay: jest.fn(),
}));

describe("ColorTyle Component", () => {
  const setSelectedTyle = jest.fn();
  const setSelectedCard = jest.fn();
  const setSelectedFigureCard = jest.fn();

  const defaultProps = {
    cardID: 0,
    type: 2,
    playerID: 1,
  };

  beforeEach(() => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedFigureCard: null,
      setSelectedFigureCard: setSelectedFigureCard,
      setSelectedCard: setSelectedCard,
      setSelectedTyle: setSelectedTyle,
    });
    sessionStorage.setItem("gameId", "1");
    sessionStorage.setItem("playerId", "1");
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("should renders the FigureCard", () => {
    const { container } = render(<FigureCard {...defaultProps} />);
    const img = container.querySelector(".figCard");
    expect(img).toHaveClass("figCard");
  });

  it("should call setSelected with correct parameters on click", () => {
    const { getByRole } = render(<FigureCard {...defaultProps} />);
    const img = getByRole("img");

    fireEvent.click(img);
    expect(setSelectedFigureCard).toHaveBeenCalledWith([0, 2]);
  });

  it("should disable the button when another tile is selected", () => {
    (useCurrentPlay as jest.Mock).mockReturnValue({
      selectedFigureCard: [1, 2],
      setSelectedFigureCard: setSelectedFigureCard,
      setSelectedCard: setSelectedCard,
      setSelectedTyle: setSelectedTyle,
    });
    const { getByRole } = render(<FigureCard {...defaultProps} />);
    const img = getByRole("img");
    const style = window.getComputedStyle(img);
    expect(style.opacity).toBe("0.5");
  });
});
