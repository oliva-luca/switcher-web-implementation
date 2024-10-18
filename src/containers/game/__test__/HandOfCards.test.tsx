import React from "react";
import { render, fireEvent } from "@testing-library/react";
import HandOfCards from "../components/movementCard/HandOfCards";
import { CurrentPlayProvider } from "../hooks/CurrentPlay.context";

describe("HandOfCards Component", () => {
  const cards = [
    { id_partida: 1, type: 1, id_movcard: 1, id_jugador: 1 },
    { id_partida: 1, type: 2, id_movcard: 2, id_jugador: 1 },
    { id_partida: 1, type: 3, id_movcard: 3, id_jugador: 1 },
  ];

  it("should render the correct number of MovCard components", () => {
    const { container } = render(
      <CurrentPlayProvider>
        <HandOfCards cards={cards} />
      </CurrentPlayProvider>
    );

    const movCards = container.querySelectorAll("img.movCard");
    expect(movCards.length).toBe(cards.length);
  });

  it("should update the selected card on click", () => {
    const { container } = render(
      <CurrentPlayProvider>
        <HandOfCards cards={cards} />
      </CurrentPlayProvider>
    );
    const movCards = container.querySelectorAll("img.movCard");

    movCards.forEach((card) => {
      expect(card).toHaveStyle("opacity: 1");
    });

    fireEvent.click(movCards[0]);

    expect(movCards[0]).toHaveStyle("opacity: 1");
    expect(movCards[1]).toHaveStyle("opacity: 0.5");
    expect(movCards[2]).toHaveStyle("opacity: 0.5");

    fireEvent.click(movCards[0]);

    movCards.forEach((card) => {
      expect(card).toHaveStyle("opacity: 1");
    });
  });
});
