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
    expect(card).toHaveStyle("opacity: 1");
  });

  it("should update opacity on click", () => {
    const { getById } = render(
      <CurrentPlayProvider>
        <MovCard cardId={cardId} type={type} />
      </CurrentPlayProvider>
    );

    const card = document.getElementById(cardId.toString());
    fireEvent.click(card);

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

    fireEvent.click(card1);

    expect(card1).toHaveStyle("opacity: 1");
    expect(card2).toHaveStyle("opacity: 0.5");
  });

  it("should deselect card when clicked again", () => {
    const { getById } = render(
      <CurrentPlayProvider>
        <MovCard cardId={cardId} type={type} />
      </CurrentPlayProvider>
    );

    const card = document.getElementById(cardId.toString());

    fireEvent.click(card);
    fireEvent.click(card);

    expect(card).toHaveStyle("opacity: 1");
  });
});
