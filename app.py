from fastapi import FastAPI
from operations import Operations

from enum import Enum
from typing import List


app= FastAPI()

@app.get("/gamelist")
async def print_games():
    operation = Operations()

    return operation.get_games()