from fastapi import FastAPI
from operations import Operations

from enum import Enum
from typing import List


app= FastAPI()

@app.get("/gamelist")
async def print_games():
    operation = Operations()

    return operation.get_games()


@app.post("/gamelist")
async def create_game(name: str, cant_players: int, private: bool, password: str):
    operation = Operations()
    new_id = operation.create_game(name=name,cant_players=cant_players,private=private,password=password)

    return {
                'id': new_id,
                'name': name,
                'operation_result': "Successfully created!"
            }


@app.put("/gamelist/join/{game_id}")
async def join_game(game_id: int, player_id: int):
    operation = Operations()
    try:
        player_id = operation.join_game(game_id=game_id, player_id=player_id)

        return {
                'id_player ': player_id,
                'id_partida': game_id,
                'operation_result': "Successfully joined!"
            }

    except GameNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except PlayerNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))  
    
    
@app.post("/",)
async def create_player(nombre: str):
    operation = Operations()
    
    return operation.create_player(nombre=nombre)