import React from 'react';
import { Row } from 'react-bootstrap';
import { MovementCard } from './components/movementCard';
import './handOfCards.css'; // Importa el archivo CSS

export function HandOfCards() {
  const cardIds = [1, 2, 3];

  return (
    <Row className="hand-of-cards">
      {cardIds.map(id => (
        <>{MovementCard(id)}</>
      ))}
    </Row>
  );
}