from fastapi import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.exc import NoResultFound
from operations import Operations, GameNotFoundError, PlayerNotFoundError, GameStartedError, GameNotStartedError, NumberOfPlayersError, manager, ConnectionManager, manager_game

from enum import Enum
from typing import List



app= FastAPI()

@app.get("/gamelist")
async def print_games():
    operation = Operations()

    return operation.get_games()

@app.get("/tableros/{game_id}")
async def print_tablero_by_id(game_id : int):
    operation = Operations()

    return operation.get_board_by_id(game_id=game_id)

@app.post("/gamelist")
async def create_game(name: str, cant_players: int):
    operation = Operations()
    new_id = await operation.create_game(name=name,cant_jugadores=cant_players,private=False,password="")

    return {
                'id': new_id,
                'name': name,
                'operation_result': "Successfully created!"
            }


@app.put("/gamelist/join/{game_id}")
async def join_game(game_id: int, player_id: int):
    operation = Operations()
    try:
        player_id = await operation.join_game(game_id=game_id, player_id=player_id)

        return {
                'id_player ': player_id,
                'id_partida': game_id,
                'operation_result': "Successfully joined!"
            }

    except GameNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except PlayerNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
        
@app.post("/user")
async def create_player(name: str):
    operation = Operations()
    
    return operation.create_player(nombre=name)



@app.put("/gamelist/start/{game_id}")
async def start_game(game_id: int):
    operation = Operations()
    try:
        return operation.start_game(game_id=game_id)
    except GameNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except GameStartedError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except NumberOfPlayersError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/gamelist/{game_id}")
async def get_game_by_id(game_id: int):
    operation = Operations()
    try:
        game = operation.get_game(game_id=game_id)
        return game
    except GameNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
        
@app.put("/end_turn/{game_id}")
async def end_turn(game_id: int):
    operation = Operations()
    try:
        return await operation.end_turn(game_id=game_id)
    
    except GameNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except GameNotStartedError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/gamelist/leave/{player_id}")
async def leave_game(player_id: int):
    operation = Operations()
    try:
        return operation.leave_game(player_id=player_id)
      
    except GameNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.put("/gamelist/leave_lobby/{player_id}")
async def leave_lobby(player_id: int):
    operation = Operations()
    try:
        return operation.leave_lobby(player_id=player_id)

    except PlayerNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Message text was: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.websocket("/ws/game/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: int):
    await manager_game.connect(game_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager_game.broadcast(f"Message text was: {data}", game_id)
    except WebSocketDisconnect:
        manager_game.disconnect(websocket, game_id)