from typing import Optional
from pydantic import BaseModel
from enum import Enum

# Tipos de carta de movimiento que hay
class MovementType(str, Enum):
    line2 = "line2"         #dos casillas vecinas en una misma fila/columna
    line3 = "line3"         #dos casillas en una misma fila/columna separadas por excatamente una casilla 
    diagonal2 = "diagonal2" #dos casillas vecinas en la misma diagonal
    diagonal3 = "diagonal3" #dos casillas en la misma diagonal separadas por excatamente una casilla 
    lShape = "lShape"       #dos casillas a distancia de caballo de ajedrez (con forma de L)
    lShapeFlipped = "lShapeFlipped" #Igual que el anterior, pero la L está espejada
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
    