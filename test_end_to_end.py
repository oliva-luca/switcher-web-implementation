import requests
import pytest
from board_to_test_board import tablero_a

SERVICE_URL = 'http://localhost:8000'

@pytest.fixture
def list_of_games():
    return [
        {'id_partida': 1, 'name': 'game1', 'cant_jugadores': 2, 'started': False, 'is_private': False, 'password': 'as', 'id_tablero': 1, 'players': [], 'movcards' : []},
        {'id_partida': 2, 'name': 'game2', 'cant_jugadores': 3, 'started': True, 'is_private': False, 'password': 'as', 'id_tablero': None, 'players': [], 'movcards' : []},
        {'id_partida': 3, 'name': 'game3', 'cant_jugadores': 4, 'started': False, 'is_private': False, 'password': 'as', 'id_tablero': None, 'players': [], 'movcards' : []},
        {'id_partida': 4, 'name': 'game4', 'cant_jugadores': 3, 'started': False, 'is_private': False, 'password': 'as', 'id_tablero': None, 'players': [], 'movcards' : []},
        {'id_partida': 5, 'name': 'game5', 'cant_jugadores': 2, 'started': False, 'is_private': False, 'password': 'as', 'id_tablero': None, 'players': [], 'movcards' : []},
    ]



    
@pytest.mark.end2end_test
def test_get_games_end_point(list_of_games):
    data = requests.get(f'{SERVICE_URL}/gamelist')
    assert data.json() == list_of_games

@pytest.mark.end2end_test
def test_get_tablero_by_id_endpoint(tablero_a):
    data = requests.get(f'{SERVICE_URL}/tableros/1')
    assert data.json() == tablero_a  
    
@pytest.mark.end2end_test
def test_get_games_by_id_end_point(list_of_games):
    data = requests.get(f'{SERVICE_URL}/gamelist/1')
    assert data.json() == list_of_games[0]
