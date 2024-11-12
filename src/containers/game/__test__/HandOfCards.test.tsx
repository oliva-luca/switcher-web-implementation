import React from "react";
import { render, fireEvent } from "@testing-library/react";
import HandOfCards from "../components/movementCard/HandOfCards";
import { CurrentPlayProvider } from "../hooks/CurrentPlay.context";

describe("Componente HandOfCards", () => {
  // Datos simulados de las cartas de movimiento
  const cards = [
    { id_partida: 1, type: 1, id_movcard: 1, id_jugador: 1 },
    { id_partida: 1, type: 2, id_movcard: 2, id_jugador: 1 },
    { id_partida: 1, type: 3, id_movcard: 3, id_jugador: 1 },
  ];

  it("debería renderizar el número correcto de componentes MovCard", () => {
    const { container } = render(
      <CurrentPlayProvider>
        <HandOfCards cards={cards} />
      </CurrentPlayProvider>
    );

    // Verificar que el número de cartas de movimiento renderizadas es el mismo que el número de cartas pasadas como props
    const movCards = container.querySelectorAll("img.movCard");
    expect(movCards.length).toBe(cards.length);
  });

  it("debería actualizar la carta seleccionada al hacer clic", () => {
    const { container } = render(
      <CurrentPlayProvider>
        <HandOfCards cards={cards} />
      </CurrentPlayProvider>
    );
    const movCards = container.querySelectorAll("img.movCard");

    // Verificar que inicialmente todas las cartas tienen opacidad completa (1)
    movCards.forEach((card) => {
      expect(card).toHaveStyle("opacity: 1");
    });

    // Simular un clic en la primera carta
    fireEvent.click(movCards[0]);

    // Verificar que la primera carta mantiene opacidad 1 y las otras dos cartas tienen opacidad 0.5
    expect(movCards[0]).toHaveStyle("opacity: 1");
    expect(movCards[1]).toHaveStyle("opacity: 0.5");
    expect(movCards[2]).toHaveStyle("opacity: 0.5");

    // Simular un clic nuevamente en la primera carta para deseleccionarla
    fireEvent.click(movCards[0]);

    // Verificar que todas las cartas tienen opacidad 1 nuevamente
    movCards.forEach((card) => {
      expect(card).toHaveStyle("opacity: 1");
    });
  });
});
