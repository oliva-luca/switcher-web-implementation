import React, { useState } from "react";
import { Row } from "react-bootstrap";
import "./HandOfCards.css";
import MovCard from "./MovCard";

interface MovCardType {
  id_partida: number; // Identificador de la partida a la que pertenece la carta
  type: number; // Tipo de la carta de movimiento
  id_movcard: number; // Identificador único de la carta de movimiento
  id_jugador: number; // Identificador del jugador propietario de la carta
  state: boolean; // Estado de la carta
}

interface HandProp {
  cards: MovCardType[];
}

/**
 * Componente de mano de cartas
 *
 * Muestra un conjunto de cartas de movimiento (MovCard) en la mano del jugador.
 * Las cartas se renderizan dentro de un contenedor de tipo `Row` de React Bootstrap.
 *
 * @param {HandProp}
 * - `card` (MovCardType[]): Lista de cartas de movimiento
 */
const HandOfCards = ({ cards }: HandProp) => {
  return (
    <Row className="hand-of-cards">
      {/* Renderiza cada carta de movimiento (MovCard) usando la propiedad `cards` */}
      {cards.map((card) => (
        <MovCard
          key={card.id_movcard}
          cardId={card.id_movcard}
          type={card.type}
          state={card.state}
        />
      ))}
    </Row>
  );
};

export default HandOfCards;
