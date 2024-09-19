from typing import Optional
from pydantic import BaseModel
from enum import Enum


# Placeholder para las figuras que hay
class FigureType(str, Enum):
    figure1 = "figure1"
    figure2 = "figure2"
    # Puedes agregar más figuras aquí

# Tipo de figura
class FigureDifficulted(str, Enum):
    dificl = "dificil"
    facil = "facil"    

# Modelo para una carta de figura
class FigureCard(BaseModel):
    id: int  # ID único de la carta
    figure: FigureType  # Tipo de figura (enum)
    description: Optional[str] = None  # Descripción opcional de la carta
    visible: bool  # Indica si la carta está en la mano
    blocked: bool  # Indica si la carta esta bloqueada o no 
    difficult: FigureDifficulted # Dificultad de la carta 



