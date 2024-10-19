import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from board_to_test_board import *

from app import app 

client = TestClient(app)



#-------------------TESTS FOR GAMELIST-------------------
@pytest.fixture
def game_a():
    return{
        "id_partida": 1,
        "name": "game_a",
        "cant_jugadores" : 2,
        "started" : False,
        "is_private" : False,
        "password" : None,
        "id_tablero" : 1,
    }
    
@pytest.fixture
def game_b():
    return{
        "id_partida": 2,
        "name": "game_b",
        "cant_jugadores" : 2,
        "started" : False,
        "is_private" : False,
        "password" : None,
        "id_tablero" : 2,
    }
    
@pytest.fixture
def list_games(game_a, game_b):
    return [game_a, game_b]   
    
@patch("app.Operations") 
def test_get_games(mock_Get_games, list_games):
    mock_games = MagicMock()
    mock_games.get_games.return_value = list_games
    mock_Get_games.return_value = mock_games
    
    response = client.get("/gamelist")
    assert response.status_code == 200
    assert response.json() == list_games
    
@patch("app.Operations")
def test_get_games_empty(mock_Get_games):
    mock_games = MagicMock()
    mock_games.get_games.return_value = []
    mock_Get_games.return_value = mock_games
    response = client.get("/gamelist")
    assert response.status_code == 200
    assert response.json() == []
    
@patch("app.Operations") 
def test_get_only_one_game(mock_Get_games, game_a):
    mock_games = MagicMock()
    mock_games.get_games.return_value = [game_a]
    mock_Get_games.return_value = mock_games
    
    response = client.get("/gamelist")
    assert response.status_code == 200
    assert response.json() == [game_a]
    

#-------------------TESTS FOR BOARD-------------------



@patch("app.Operations") 
@patch("app.modificar_tablero")
def test_get_tablero_by_id(mock_modificar_tablero, mock_Operations, tablero_a, tablero_b):
    mock_operations = MagicMock()
    mock_operations.get_board_by_id.return_value = tablero_a
    mock_Operations.return_value = mock_operations
    mock_modificar_tablero.return_value = tablero_b
    
    response = client.get("/tableros/1")
    assert response.status_code == 200
    assert response.json() == tablero_b



@patch("app.Operations")
def test_get_games_by_id(mock_Get_games, game_a):
    mock_games = MagicMock()
    mock_games.get_game.return_value = game_a
    mock_Get_games.return_value = mock_games
    
    response = client.get("/gamelist/1")
    assert response.status_code == 200
    assert response.json() == game_a

@pytest.fixture
def player_a():
    return {
        "block": False,
        "id_jugador": 2,
        "id_partida": 3,
        "in_game": False,
        "nombre": "pepe",
        "position": None,
    }

@patch("app.Operations")
def test_get_player(mock_Get_player, player_a):
    mock_player = MagicMock()
    mock_player.get_player.return_value = player_a
    
    mock_Get_player.return_value = mock_player
    
    response = client.get("/user/2")
    assert response.status_code == 200
    assert response.json() == player_a