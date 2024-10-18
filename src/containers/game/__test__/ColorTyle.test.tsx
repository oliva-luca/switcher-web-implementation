import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import ColorTyle from "../components/mainBoard/ColorTyle";

describe("ColorTyle Component", () => {
  const defaultProps = {
    col: 0,
    row: 0,
    color: "rojo",
    selected: null,
    setSelected: jest.fn(),
  };

  it("renders ColorTyle with the correct color class", () => {
    const { container } = render(<ColorTyle {...defaultProps} />);
    const button = container.querySelector(".colorTyle");
    expect(button).toHaveClass("rojo");
  });

  it("calls setSelected with correct parameters on click", () => {
    const setSelectedMock = jest.fn();
    const { getByRole } = render(
      <ColorTyle {...defaultProps} setSelected={setSelectedMock} />
    );
    const button = getByRole("button");

    fireEvent.click(button);
    expect(setSelectedMock).toHaveBeenCalledWith([0, 0]);
  });

  it("applies the selectedTyle class when the tile is selected", () => {
    const { container } = render(
      <ColorTyle {...defaultProps} selected={[0, 0]} />
    );
    const button = container.querySelector(".colorTyle");
    expect(button).toHaveClass("selectedTyle");
  });

  it("disables the button when another tile is selected", () => {
    const { getByRole } = render(
      <ColorTyle {...defaultProps} selected={[1, 1]} />
    );
    const button = getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows the square marker when selected", () => {
    const { container } = render(
      <ColorTyle {...defaultProps} selected={[0, 0]} />
    );
    const marker = container.querySelector(".squareMarker");
    expect(marker).toBeInTheDocument();
  });

  it("renders colorless tyle", () => {
    const { container } = render(<ColorTyle />);
    const tyle = container.querySelector(".colorTyle");
    expect(tyle).toBeInTheDocument();
    const red = container.querySelector(".red");
    expect(red).not.toBeInTheDocument();
  });
});
