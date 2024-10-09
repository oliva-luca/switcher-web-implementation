import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import MovCard from "../components/movementCard/MovCard";

describe("MovCard Component", () => {
  const mockSetSelected = jest.fn();

  it("should render all the MovCards correctly", () => {
    const allMovCards = [];
    for (var i = 1; i <= 7; i++) {
      allMovCards.push({
        cardId: i,
        type: i,
        selected: null,
        setSelected: jest.fn(),
      });
    }
    const { getAllByAltText } = render(
      <>
        {allMovCards.map((card) => (
          <MovCard
            cardId={card.cardId}
            type={card.type}
            selected={card.selected}
            setSelected={card.setSelected}
          />
        ))}
      </>
    );
    const MovCards = getAllByAltText("carta de movimiento");
    expect(MovCards.length).toBe(7);
  });

  it("should have full opacity when selected or no card is selected", () => {
    const { getByAltText } = render(
      <MovCard
        cardId={1}
        type={2}
        selected={null}
        setSelected={mockSetSelected}
      />
    );
    const imgElement = getByAltText("carta de movimiento");
    expect(imgElement).toHaveStyle("opacity: 1");
  });

  it("should have lower opacity when another card is selected", () => {
    const { getByAltText } = render(
      <MovCard cardId={1} type={2} selected={2} setSelected={mockSetSelected} />
    );
    const imgElement = getByAltText("carta de movimiento");
    expect(imgElement).toHaveStyle("opacity: 0.5");
  });

  it("should change height when selected", () => {
    const { getByAltText } = render(
      <MovCard cardId={1} type={2} selected={1} setSelected={mockSetSelected} />
    );
    const imgElement = getByAltText("carta de movimiento");
    expect(imgElement).toHaveStyle("height: 200px");
  });

  it("should call setSelected with the correct cardId on click", () => {
    const { getByAltText } = render(
      <MovCard
        cardId={1}
        type={2}
        selected={null}
        setSelected={mockSetSelected}
      />
    );
    const imgElement = getByAltText("carta de movimiento");
    fireEvent.click(imgElement);
    expect(mockSetSelected).toHaveBeenCalledWith(1);
  });

  it("should toggle selection state when clicked", () => {
    const { getByAltText } = render(
      <MovCard cardId={1} type={2} selected={1} setSelected={mockSetSelected} />
    );
    const imgElement = getByAltText("carta de movimiento");
    fireEvent.click(imgElement);
    expect(mockSetSelected).toHaveBeenCalledWith(null); // If selected, deselect
  });
});
