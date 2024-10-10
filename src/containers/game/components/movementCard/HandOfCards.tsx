import React, { useState } from "react";
import { Row } from "react-bootstrap";
import "./HandOfCards.css"; // Importa el archivo CSS
import MovCard from "./MovCard";

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
  const [selectedMov, setSelectedMov] = useState<number | null>(null);

  return (
    <Row className="hand-of-cards">
      {cards.map((card) => (
        <MovCard
          cardId={card.id_movcard}
          type={card.type}
          selected={selectedMov}
          setSelected={setSelectedMov}
        />
      ))}
    </Row>
  );
};

export default HandOfCards;
