import requests
import pytest
from board_to_test_board import tablero_a, list_of_games

SERVICE_URL = 'http://localhost:8000'

       

    
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

@pytest.mark.end2end_test
def test_get_player_end_point():
    data = requests.get(f'{SERVICE_URL}/user/1')
    assert data.json() == {'block': False,'id_jugador': 1,'id_partida': None,'in_game': False,'nombre': 'player1','position': None, 'figcards' : [], 'movcards' : [], 'game' : None}