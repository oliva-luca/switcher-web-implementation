import React from "react";
import { render, act } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import FigureBoard from "../components/mainBoard/FigureBoard";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("axios");
jest.mock("sweetalert2");

describe("FigureBoard Component", () => {
  it("should render all 4 figureBoards with their content", () => {
    const { container } = render(
      <Router>
        <FigureBoard pos={"lft"} deck={4} />
        <FigureBoard pos={"rgt"} deck={4} />
        <FigureBoard pos={"btm"} deck={4} />
        <FigureBoard pos={"top"} deck={4} />
      </Router>
    );

    const lft_rgt = container.querySelectorAll(".figureBoardSide");
    const top_btm = container.querySelectorAll(".figureBoard");

    expect(lft_rgt).toHaveLength(2);
    expect(top_btm).toHaveLength(2);

    const figures = container.querySelectorAll(".figureDeck");

    expect(figures).toHaveLength(16);
  });
});
