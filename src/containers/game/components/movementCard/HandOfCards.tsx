import React from "react";
import { Row } from "react-bootstrap";
import "./HandOfCards.css"; // Importa el archivo CSS

interface CardProp {
  id: number;
}

interface HandProp {
  cards: number[];
}

const Card = ({ id }: CardProp) => {
  return (
    <img
      className="movCard"
      src={"/mov" + id + ".svg"}
      alt="carta de movimiento"
      id="imagen"
    />
  );
};

const HandOfCards = ({ cards }: HandProp) => {
  return (
    <Row className="hand-of-cards">
      {cards.map((card) => (
        <Card id={card} />
      ))}
    </Row>
  );
};

export default HandOfCards;
