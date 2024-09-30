import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

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
    
@patch("app.Operations")
def test_get_games_by_id(mock_Get_games, game_a):
    mock_games = MagicMock()
    mock_games.get_game.return_value = game_a
    mock_Get_games.return_value = mock_games
    
    response = client.get("/gamelist/1")
    assert response.status_code == 200
    assert response.json() == game_a