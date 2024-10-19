import pytest 
from models import Tablero, Casilla

@pytest.fixture
def tablero_a():
    return{
    "color_principal": None,
    "id_tablero": 1,
    "casillas": [
    {
      "color": "verde",
      "id_casilla": 1,
      "fila": 0,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 2,
      "fila": 0,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 3,
      "fila": 0,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 4,
      "fila": 0,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 5,
      "fila": 0,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 6,
      "fila": 0,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 7,
      "fila": 1,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 8,
      "fila": 1,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 9,
      "fila": 1,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 10,
      "fila": 1,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 11,
      "fila": 1,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 12,
      "fila": 1,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 13,
      "fila": 2,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 14,
      "fila": 2,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 15,
      "fila": 2,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 16,
      "fila": 2,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 17,
      "fila": 2,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 18,
      "fila": 2,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 19,
      "fila": 3,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 20,
      "fila": 3,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 21,
      "fila": 3,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 22,
      "fila": 3,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 23,
      "fila": 3,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 24,
      "fila": 3,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 25,
      "fila": 4,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 26,
      "fila": 4,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 27,
      "fila": 4,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 28,
      "fila": 4,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 29,
      "fila": 4,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 30,
      "fila": 4,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 31,
      "fila": 5,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 32,
      "fila": 5,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 33,
      "fila": 5,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 34,
      "fila": 5,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 35,
      "fila": 5,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 36,
      "fila": 5,
      "columna": 5,
      "id_tablero": 1
    }
  ]
}

@pytest.fixture
def tablero_b():
    return{
    "color_principal": None,
    "id_tablero": 1,
    "casillas": [
    {
      "color": "amarillo",
      "id_casilla": 1,
      "fila": 0,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 2,
      "fila": 0,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 3,
      "fila": 0,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 4,
      "fila": 0,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 5,
      "fila": 0,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 6,
      "fila": 0,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 7,
      "fila": 1,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 8,
      "fila": 1,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 9,
      "fila": 1,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 10,
      "fila": 1,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 11,
      "fila": 1,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 12,
      "fila": 1,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 13,
      "fila": 2,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 14,
      "fila": 2,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 15,
      "fila": 2,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 16,
      "fila": 2,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 17,
      "fila": 2,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 18,
      "fila": 2,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 19,
      "fila": 3,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 20,
      "fila": 3,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 21,
      "fila": 3,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 22,
      "fila": 3,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 23,
      "fila": 3,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 24,
      "fila": 3,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 25,
      "fila": 4,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 26,
      "fila": 4,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 27,
      "fila": 4,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 28,
      "fila": 4,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 29,
      "fila": 4,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 30,
      "fila": 4,
      "columna": 5,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 31,
      "fila": 5,
      "columna": 0,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 32,
      "fila": 5,
      "columna": 1,
      "id_tablero": 1
    },
    {
      "color": "rojo",
      "id_casilla": 33,
      "fila": 5,
      "columna": 2,
      "id_tablero": 1
    },
    {
      "color": "verde",
      "id_casilla": 34,
      "fila": 5,
      "columna": 3,
      "id_tablero": 1
    },
    {
      "color": "amarillo",
      "id_casilla": 35,
      "fila": 5,
      "columna": 4,
      "id_tablero": 1
    },
    {
      "color": "azul",
      "id_casilla": 36,
      "fila": 5,
      "columna": 5,
      "id_tablero": 1
    }
  ]
}




@pytest.fixture
def list_of_games():
    return [
        {'id_partida': 1, 'name': 'game1', 'cant_jugadores': 1, 'started': False, 'is_private': False, 'password': 'as', 'turn' : None, 'owner' : None , 'id_tablero': 1, 'players': [], 'movcards' : [], 'figcards' : []},
        {'id_partida': 2, 'name': 'game2', 'cant_jugadores': 3, 'started': True, 'is_private': False, 'password': 'as', 'turn' : None, 'owner' : None , 'id_tablero': None, 'players': [], 'movcards' : [], 'figcards' : []},
        {'id_partida': 3, 'name': 'game3', 'cant_jugadores': 2, 'started': False, 'is_private': False, 'password': 'as', 'turn' : None, 'owner' : None , 'id_tablero': None, 'players': [
                {'block': False,'id_jugador': 2,'id_partida': 3,'in_game': False,'nombre': 'player2','position': None,},
                {'block': False,'id_jugador': 3,'id_partida': 3,'in_game': False,'nombre': 'player3','position': None,},], 'movcards' : [], 'figcards' : []},
        {'id_partida': 4, 'name': 'game4', 'cant_jugadores': 3, 'started': False, 'is_private': False, 'password': 'as', 'turn' : None, 'owner' : None , 'id_tablero': None, 'players': [], 'movcards' : [], 'figcards' : []},
        {'id_partida': 5, 'name': 'game5', 'cant_jugadores': 2, 'started': True, 'is_private': False, 'password': 'as', 'turn' : 4, 'owner' : None , 'id_tablero': None, 'players': [
                {'block': False,'id_jugador': 4,'id_partida': 5,'in_game': False,'nombre': 'player4','position': 0,},
                {'block': False,'id_jugador': 5,'id_partida': 5,'in_game': False,'nombre': 'player5','position': 1,},], 'movcards' : [], 'figcards' : []},
        {'id_partida': 6, 'name': 'game6', 'cant_jugadores': 2, 'started': True, 'is_private': False, 'password': 'as', 'turn' : 7, 'owner' : None , 'id_tablero': None, 'players': [
                {'block': False,'id_jugador': 6,'id_partida': 6,'in_game': True,'nombre': 'player6','position': 1,},
                {'block': False,'id_jugador': 7,'id_partida': 6,'in_game': True,'nombre': 'player7','position': 0,},], 'movcards' : [
                {"id_partida": 6, "id_movcard": 1, "type": 1, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 2, "type": 2, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 3, "type": 3, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 4, "type": 4, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 5, "type": 5, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 6, "type": 6, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 7, "type": 7, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 8, "type": 1, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 9, "type": 2, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 10, "type": 3, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 11, "type": 4, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 12, "type": 5, "id_jugador": 6}, 
        {"id_partida": 6, "id_movcard": 13, "type": 6, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 14, "type": 7, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 15, "type": 1, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 16, "type": 2, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 17, "type": 3, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 18, "type": 4, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 19, "type": 5, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 20, "type": 6, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 21, "type": 7, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 22, "type": 1, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 23, "type": 2, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 24, "type": 3, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 25, "type": 4, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 26, "type": 5, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 27, "type": 6, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 28, "type": 7, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 29, "type": 1, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 30, "type": 2, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 31, "type": 3, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 32, "type": 4, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 33, "type": 5, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 34, "type": 6, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 35, "type": 7, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 36, "type": 1, "id_jugador": 7},
        {"id_partida": 6, "id_movcard": 37, "type": 2, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 38, "type": 3, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 39, "type": 4, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 40, "type": 5, "id_jugador": 7}, 
        {"id_partida": 6, "id_movcard": 41, "type": 6, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 42, "type": 7, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 43, "type": 1, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 44, "type": 2, "id_jugador": 6}, 
        {"id_partida": 6, "id_movcard": 45, "type": 3, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 46, "type": 4, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 47, "type": 5, "id_jugador": 7}, 
        {"id_partida": 6, "id_movcard": 48, "type": 6, "id_jugador": None}, 
        {"id_partida": 6, "id_movcard": 49, "type": 7, "id_jugador": 6},
                ], 'figcards' : []},
        
    ]

 