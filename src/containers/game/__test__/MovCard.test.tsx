import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { CurrentPlayProvider } from "../hooks/CurrentPlay.context";
import MovCard from "../components/movementCard/MovCard";

describe("MovCard Component", () => {
  const cardId = 1;
  const type = 1;

  it("should render the card with the correct properties", () => {
    const { getById } = render(
      <CurrentPlayProvider>
        <MovCard cardId={cardId} type={type} />
      </CurrentPlayProvider>
    );

    const card = document.getElementById(cardId.toString());
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("src", `/mov${type}.svg`);
    expect(card).toHaveClass("movCard");
    expect(card).toHaveStyle("opacity: 1"); // Initially, opacity should be 1
  });

  it("should update opacity on click", () => {
    const { getById } = render(
      <CurrentPlayProvider>
        <MovCard cardId={cardId} type={type} />
      </CurrentPlayProvider>
    );

    const card = document.getElementById(cardId.toString());

    // Click the card to select it
    fireEvent.click(card);

    // After clicking, the opacity should remain 1 if it's selected
    expect(card).toHaveStyle("opacity: 1");
  });

  it("should change opacity of other cards when clicked", () => {
    const { getById } = render(
      <CurrentPlayProvider>
        <MovCard cardId={cardId} type={type} />
        <MovCard cardId={2} type={2} />
      </CurrentPlayProvider>
    );

    const card1 = document.getElementById(cardId.toString());
    const card2 = document.getElementById("2");

    // Click the first card to select it
    fireEvent.click(card1);

    // The first card should have full opacity
    expect(card1).toHaveStyle("opacity: 1");
    // The second card should have lower opacity (0.5) since it was not selected
    expect(card2).toHaveStyle("opacity: 0.5");
  });

  it("should deselect card when clicked again", () => {
    const { getById } = render(
      <CurrentPlayProvider>
        <MovCard cardId={cardId} type={type} />
      </CurrentPlayProvider>
    );

    const card = document.getElementById(cardId.toString());

    // Click the card to select it
    fireEvent.click(card);

    // Click it again to deselect
    fireEvent.click(card);

    // After deselecting, the opacity should return to 1
    expect(card).toHaveStyle("opacity: 1");
  });
});
