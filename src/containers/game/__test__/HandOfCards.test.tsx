import React from "react";
import { render, fireEvent } from "@testing-library/react";
import HandOfCards from "../components/movementCard/HandOfCards";
import MovCard from "../components/movementCard/MovCard";

describe("HandOfCards Component", () => {
  const cards = [
    { id_partida: 1, type: 1, id_movcard: 1, id_jugador: 1 },
    { id_partida: 1, type: 2, id_movcard: 2, id_jugador: 1 },
    { id_partida: 1, type: 3, id_movcard: 3, id_jugador: 1 },
  ];

  it("should render the correct number of MovCard components", () => {
    const { getAllByAltText } = render(<HandOfCards cards={cards} />);

    const movCards = getAllByAltText("carta de movimiento");
    expect(movCards.length).toBe(cards.length); // Expect the same number of cards as provided
  });

  it("should update the selected card on click", () => {
    const { getAllByAltText } = render(<HandOfCards cards={cards} />);
    const movCards = getAllByAltText("carta de movimiento");

    // Initially no card should be selected (opacity 1 for all)
    movCards.forEach((card) => {
      expect(card).toHaveStyle("opacity: 1");
    });

    // Click on the first card
    fireEvent.click(movCards[0]);

    // First card should now be selected (opacity: 1) and other cards should have lower opacity
    expect(movCards[0]).toHaveStyle("opacity: 1");
    expect(movCards[1]).toHaveStyle("opacity: 0.5");
    expect(movCards[2]).toHaveStyle("opacity: 0.5");

    // Click on the first card again to deselect it
    fireEvent.click(movCards[0]);

    // All cards should return to unselected state (opacity 1 for all)
    movCards.forEach((card) => {
      expect(card).toHaveStyle("opacity: 1");
    });
  });
});
