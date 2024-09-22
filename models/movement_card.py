from typing import Optional
from pydantic import BaseModel
from enum import Enum

# Tipos de carta de movimiento que hay
class MovementType(str, Enum):
    line2 = "line2"
    line3 = "line3" 
    diagonal2 = "diagonal2"
    diagonal3 = "diagonal3"
    lShape = "lShape"
    lShapeFlipped = "lShapeFlipped"
    # Puedes agregar más figuras aquí
    
# Estado actual de la carta de movimiento
# Puede estar en el mazo, en la mano de alguien o descartada
class CardStatus(str, Enum):
    inDeck = "inDeck"
    inHand = "inHand"
    discarded = "discarded"

# Modelo para una carta de movimiento
class MovementCard(BaseModel):
    id: int                             # ID único de la carta
    type: MovementType                  # Tipo de moviento (enum)
    state : CardStatus                  # Estados actual de la carta (enum)
    description: Optional[str] = None   # Descripción opcional de la carta
    