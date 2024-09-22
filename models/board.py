from pydantic import BaseModel
from enum import Enum
from typing import List,Optional

class ColorSquare(str,Enum):
    red = "red"
    yellow = "yellow"
    blue = "blue"
    green = "green"

class Square(BaseModel):
    row:int
    column:int
    color:ColorSquare

class BoardGame(BaseModel):
    board : List[Square]
    forbidden_color : Optional[ColorSquare] = None

