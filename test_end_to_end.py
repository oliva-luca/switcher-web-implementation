import requests
import pytest

SERVICE_URL = 'http://localhost:8000'

@pytest.fixture
def list_of_games():
    return [
        {'id_partida': 1, 'name': 'game1', 'cant_jugadores': 2, 'started': False, 'is_private': False, 'password': 'as', 'id_tablero': 1, 'players': []},
        {'id_partida': 2, 'name': 'game2', 'cant_jugadores': 3, 'started': True, 'is_private': False, 'password': 'as', 'id_tablero': 2, 'players': []},
        {'id_partida': 3, 'name': 'game3', 'cant_jugadores': 4, 'started': False, 'is_private': False, 'password': 'as', 'id_tablero': 3, 'players': []},
        {'id_partida': 4, 'name': 'game4', 'cant_jugadores': 3, 'started': False, 'is_private': False, 'password': 'as', 'id_tablero': 4, 'players': []},
        {'id_partida': 5, 'name': 'game5', 'cant_jugadores': 2, 'started': False, 'is_private': False, 'password': 'as', 'id_tablero': 5, 'players': []},
    ]
    
@pytest.mark.end2end_test
def test_get_games_end_point(list_of_games):
    data = requests.get(f'{SERVICE_URL}/gamelist')
    assert data.json() == list_of_games