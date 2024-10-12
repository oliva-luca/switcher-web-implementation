import React, { useState } from "react";
import { Row } from "react-bootstrap";
import "./HandOfCards.css"; // Importa el archivo CSS
import MovCard from "./MovCard";
import { SelectedCardProvider } from "../../hooks/CurrentPlay.context";

interface MovCardType {
  id_partida: number;
  type: number;
  id_movcard: number;
  id_jugador: number;
}

interface HandProp {
  cards: MovCardType[];
}

const HandOfCards = ({ cards }: HandProp) => {
  return (
    <Row className="hand-of-cards">
      {cards.map((card) => (
        <MovCard
          key={card.id_movcard}
          cardId={card.id_movcard}
          type={card.type}
        />
      ))}
    </Row>
  );
};

export default HandOfCards;
