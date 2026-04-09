from sqlalchemy.orm import sessionmaker
from datetime import datetime

from models import Game, engine, Player, User ,FigCard, MovCard, Tablero, Casilla, Mensaje



Session = sessionmaker(bind=engine)

def load_data_for_test():
    games = [
        (1, 'game1', 1, False, False, 'as', None, 1),
        (2, 'game2', 3, True, False, 'as', None, 2),
        (3, 'game3', 2, False, False, 'as', None, None),
        (4, 'game4', 3, False, False, 'as', None, None),
        (5, 'game5', 2, True, False, 'as', 4, 3),
        (6, 'game6', 2, True, False, 'as', 7, None),
        (7, 'game7', 2, False, False, 'as', 8, 7),
        (8, 'game8', 2, True, False, 'as', 10, 4),

    ]
    
    users = [
        (1, 'user1'),
        (2, 'user2'),
        (3, 'user3'),
        (4, 'user4'),
        (5, 'user5'),
        (6, 'user6'),
    ]

    players = [
        (1, 'player1', False, False, None, None),
        (2, 'player2', False, False, None, 3),
        (3, 'player3', False, False, None, 3),
        (4, 'player4', False, False, 0, 5),
        (5, 'player5', False, False, 1, 5),
        (6, 'player6', True, False, 1, 6),
        (7, 'player7', True, False, 0, 6),
        (8, 'player8', True, False, 0, 7),
        (9, 'player9', True, False, 1, 7),
        (10, 'player10', True, False, 0, 8),
        (11, 'player11', True, False, 1, 8),
    ]

    tableros = [(None, 1), (None, 3), (None, 4)]
    casillas = [
        {"color": "verde", "id_casilla": 1, "fila": 0, "columna": 0, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 2, "fila": 0, "columna": 1, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 3, "fila": 0, "columna": 2, "id_tablero": 1},
        {"color": "azul", "id_casilla": 4, "fila": 0, "columna": 3, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 5, "fila": 0, "columna": 4, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 6, "fila": 0, "columna": 5, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 7, "fila": 1, "columna": 0, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 8, "fila": 1, "columna": 1, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 9, "fila": 1, "columna": 2, "id_tablero": 1},
        {"color": "azul", "id_casilla": 10, "fila": 1, "columna": 3, "id_tablero": 1},
        {"color": "verde", "id_casilla": 11, "fila": 1, "columna": 4, "id_tablero": 1},
        {"color": "verde", "id_casilla": 12, "fila": 1, "columna": 5, "id_tablero": 1},
        {"color": "azul", "id_casilla": 13, "fila": 2, "columna": 0, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 14, "fila": 2, "columna": 1, "id_tablero": 1},
        {"color": "azul", "id_casilla": 15, "fila": 2, "columna": 2, "id_tablero": 1},
        {"color": "verde", "id_casilla": 16, "fila": 2, "columna": 3, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 17, "fila": 2, "columna": 4, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 18, "fila": 2, "columna": 5, "id_tablero": 1},
        {"color": "azul", "id_casilla": 19, "fila": 3, "columna": 0, "id_tablero": 1},
        {"color": "verde", "id_casilla": 20, "fila": 3, "columna": 1, "id_tablero": 1},
        {"color": "azul", "id_casilla": 21, "fila": 3, "columna": 2, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 22, "fila": 3, "columna": 3, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 23, "fila": 3, "columna": 4, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 24, "fila": 3, "columna": 5, "id_tablero": 1},
        {"color": "verde", "id_casilla": 25, "fila": 4, "columna": 0, "id_tablero": 1},
        {"color": "verde", "id_casilla": 26, "fila": 4, "columna": 1, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 27, "fila": 4, "columna": 2, "id_tablero": 1},
        {"color": "azul", "id_casilla": 28, "fila": 4, "columna": 3, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 29, "fila": 4, "columna": 4, "id_tablero": 1},
        {"color": "verde", "id_casilla": 30, "fila": 4, "columna": 5, "id_tablero": 1},
        {"color": "azul", "id_casilla": 31, "fila": 5, "columna": 0, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 32, "fila": 5, "columna": 1, "id_tablero": 1},
        {"color": "rojo", "id_casilla": 33, "fila": 5, "columna": 2, "id_tablero": 1},
        {"color": "verde", "id_casilla": 34, "fila": 5, "columna": 3, "id_tablero": 1},
        {"color": "amarillo", "id_casilla": 35, "fila": 5, "columna": 4, "id_tablero": 1},
        {"color": "azul", "id_casilla": 36, "fila": 5, "columna": 5, "id_tablero": 1},

        {"color": "verde", "id_casilla": 101, "fila": 0, "columna": 0, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 102, "fila": 0, "columna": 1, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 103, "fila": 0, "columna": 2, "id_tablero": 2},
        {"color": "azul", "id_casilla": 104, "fila": 0, "columna": 3, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 105, "fila": 0, "columna": 4, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 106, "fila": 0, "columna": 5, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 107, "fila": 1, "columna": 0, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 108, "fila": 1, "columna": 1, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 109, "fila": 1, "columna": 2, "id_tablero": 2},
        {"color": "azul", "id_casilla": 110, "fila": 1, "columna": 3, "id_tablero": 2},
        {"color": "verde", "id_casilla": 111, "fila": 1, "columna": 4, "id_tablero": 2},
        {"color": "verde", "id_casilla": 112, "fila": 1, "columna": 5, "id_tablero": 2},
        {"color": "azul", "id_casilla": 113, "fila": 2, "columna": 0, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 114, "fila": 2, "columna": 1, "id_tablero": 2},
        {"color": "azul", "id_casilla": 115, "fila": 2, "columna": 2, "id_tablero": 2},
        {"color": "verde", "id_casilla": 116, "fila": 2, "columna": 3, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 117, "fila": 2, "columna": 4, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 118, "fila": 2, "columna": 5, "id_tablero": 2},
        {"color": "azul", "id_casilla": 119, "fila": 3, "columna": 0, "id_tablero": 2},
        {"color": "verde", "id_casilla": 120, "fila": 3, "columna": 1, "id_tablero": 2},
        {"color": "azul", "id_casilla": 121, "fila": 3, "columna": 2, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 122, "fila": 3, "columna": 3, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 123, "fila": 3, "columna": 4, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 124, "fila": 3, "columna": 5, "id_tablero": 2},
        {"color": "verde", "id_casilla": 125, "fila": 4, "columna": 0, "id_tablero": 2},
        {"color": "verde", "id_casilla": 126, "fila": 4, "columna": 1, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 127, "fila": 4, "columna": 2, "id_tablero": 2},
        {"color": "azul", "id_casilla": 128, "fila": 4, "columna": 3, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 129, "fila": 4, "columna": 4, "id_tablero": 2},
        {"color": "verde", "id_casilla": 130, "fila": 4, "columna": 5, "id_tablero": 2},
        {"color": "azul", "id_casilla": 131, "fila": 5, "columna": 0, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 132, "fila": 5, "columna": 1, "id_tablero": 2},
        {"color": "rojo", "id_casilla": 133, "fila": 5, "columna": 2, "id_tablero": 2},
        {"color": "verde", "id_casilla": 134, "fila": 5, "columna": 3, "id_tablero": 2},
        {"color": "amarillo", "id_casilla": 135, "fila": 5, "columna": 4, "id_tablero": 2},
        {"color": "azul", "id_casilla": 136, "fila": 5, "columna": 5, "id_tablero": 2},

        {"color": "verde", "id_casilla": 201, "fila": 0, "columna": 0, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 202, "fila": 0, "columna": 1, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 203, "fila": 0, "columna": 2, "id_tablero": 3},
        {"color": "azul", "id_casilla": 204, "fila": 0, "columna": 3, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 205, "fila": 0, "columna": 4, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 206, "fila": 0, "columna": 5, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 207, "fila": 1, "columna": 0, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 208, "fila": 1, "columna": 1, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 209, "fila": 1, "columna": 2, "id_tablero": 3},
        {"color": "azul", "id_casilla": 210, "fila": 1, "columna": 3, "id_tablero": 3},
        {"color": "verde", "id_casilla": 211, "fila": 1, "columna": 4, "id_tablero": 3},
        {"color": "verde", "id_casilla": 212, "fila": 1, "columna": 5, "id_tablero": 3},
        {"color": "azul", "id_casilla": 213, "fila": 2, "columna": 0, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 214, "fila": 2, "columna": 1, "id_tablero": 3},
        {"color": "azul", "id_casilla": 215, "fila": 2, "columna": 2, "id_tablero": 3},
        {"color": "verde", "id_casilla": 216, "fila": 2, "columna": 3, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 217, "fila": 2, "columna": 4, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 218, "fila": 2, "columna": 5, "id_tablero": 3},
        {"color": "azul", "id_casilla": 219, "fila": 3, "columna": 0, "id_tablero": 3},
        {"color": "verde", "id_casilla": 220, "fila": 3, "columna": 1, "id_tablero": 3},
        {"color": "azul", "id_casilla": 221, "fila": 3, "columna": 2, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 222, "fila": 3, "columna": 3, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 223, "fila": 3, "columna": 4, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 224, "fila": 3, "columna": 5, "id_tablero": 3},
        {"color": "verde", "id_casilla": 225, "fila": 4, "columna": 0, "id_tablero": 3},
        {"color": "verde", "id_casilla": 226, "fila": 4, "columna": 1, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 227, "fila": 4, "columna": 2, "id_tablero": 3},
        {"color": "azul", "id_casilla": 228, "fila": 4, "columna": 3, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 229, "fila": 4, "columna": 4, "id_tablero": 3},
        {"color": "verde", "id_casilla": 230, "fila": 4, "columna": 5, "id_tablero": 3},
        {"color": "azul", "id_casilla": 231, "fila": 5, "columna": 0, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 232, "fila": 5, "columna": 1, "id_tablero": 3},
        {"color": "rojo", "id_casilla": 233, "fila": 5, "columna": 2, "id_tablero": 3},
        {"color": "verde", "id_casilla": 234, "fila": 5, "columna": 3, "id_tablero": 3},
        {"color": "amarillo", "id_casilla": 235, "fila": 5, "columna": 4, "id_tablero": 3},
        {"color": "azul", "id_casilla": 236, "fila": 5, "columna": 5, "id_tablero": 3},
    ]

    movcards = [
        {"id_partida": 6, "id_movcard": 1, "type": 1, "id_jugador": None, "state": False}, 
        {"id_partida": 6, "id_movcard": 2, "type": 2, "id_jugador": None, "state": False}, 
        {"id_partida": 6, "id_movcard": 3, "type": 3, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 4, "type": 4, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 5, "type": 5, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 6, "type": 6, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 7, "type": 7, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 8, "type": 1, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 9, "type": 2, "id_jugador": None,"state": False}, 
        {"id_partida": 6, "id_movcard": 10, "type": 3, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 11, "type": 4, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 12, "type": 5, "id_jugador": 6, "state":False}, 
        {"id_partida": 6, "id_movcard": 13, "type": 6, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 14, "type": 7, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 15, "type": 1, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 16, "type": 2, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 17, "type": 3, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 18, "type": 4, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 19, "type": 5, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 20, "type": 6, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 21, "type": 7, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 22, "type": 1, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 23, "type": 2, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 24, "type": 3, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 25, "type": 4, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 26, "type": 5, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 27, "type": 6, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 28, "type": 7, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 29, "type": 1, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 30, "type": 2, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 31, "type": 3, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 32, "type": 4, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 33, "type": 5, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 34, "type": 6, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 35, "type": 7, "id_jugador": None,"state": False}, 
        {"id_partida": 6, "id_movcard": 36, "type": 1, "id_jugador": 7, "state":False},
        {"id_partida": 6, "id_movcard": 37, "type": 2, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 38, "type": 3, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 39, "type": 4, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 40, "type": 5, "id_jugador": 7, "state":False}, 
        {"id_partida": 6, "id_movcard": 41, "type": 6, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 42, "type": 7, "id_jugador": None,"state": False}, 
        {"id_partida": 6, "id_movcard": 43, "type": 1, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 44, "type": 2, "id_jugador": 6, "state":False}, 
        {"id_partida": 6, "id_movcard": 45, "type": 3, "id_jugador": None,"state": False}, 
        {"id_partida": 6, "id_movcard": 46, "type": 4, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 47, "type": 5, "id_jugador": 7, "state":False}, 
        {"id_partida": 6, "id_movcard": 48, "type": 6, "id_jugador": None, "state":False}, 
        {"id_partida": 6, "id_movcard": 49, "type": 7, "id_jugador": 6,"state": False}
    ]


    figcards = [
        {"type": 1, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 1, "id_jugador": 7}, 
        {"type": 2, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 2, "id_jugador": 6}, 
        {"type": 3, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 3, "id_jugador": 7}, 
        {"type": 4, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 4, "id_jugador": 6}, 
        {"type": 5, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 5, "id_jugador": 7}, 
        {"type": 6, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 6, "id_jugador": 7}, 
        {"type": 7, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 7, "id_jugador": 7}, 
        {"type": 8, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 8, "id_jugador": 6}, 
        {"type": 9, "id_partida": 6, "shown": True, "blocked": False, "id_figcard": 9, "id_jugador": 6}, 
        {"type": 10, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 10, "id_jugador": 7}, 
        {"type": 11, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 11, "id_jugador": 6}, 
        {"type": 12, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 12, "id_jugador": 7}, 
        {"type": 13, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 13, "id_jugador": 7}, 
        {"type": 14, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 14, "id_jugador": 6}, 
        {"type": 15, "id_partida": 6, "shown": True, "blocked": False, "id_figcard": 15, "id_jugador": 6}, 
        {"type": 16, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 16, "id_jugador": 7}, 
        {"type": 17, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 17, "id_jugador": 6}, 
        {"type": 18, "id_partida": 6, "shown": True, "blocked": False, "id_figcard": 18, "id_jugador": 7}, 
        {"type": 19, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 19, "id_jugador": 7}, 
        {"type": 20, "id_partida": 6, "shown": True, "blocked": False, "id_figcard": 20, "id_jugador": 6}, 
        {"type": 21, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 21, "id_jugador": 6}, 
        {"type": 22, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 22, "id_jugador": 7}, 
        {"type": 23, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 23, "id_jugador": 6}, 
        {"type": 24, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 24, "id_jugador": 7}, 
        {"type": 25, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 25, "id_jugador": 7}, 
        {"type": 1, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 26, "id_jugador": 7}, 
        {"type": 2, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 27, "id_jugador": 7}, 
        {"type": 3, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 28, "id_jugador": 7}, 
        {"type": 4, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 29, "id_jugador": 6}, 
        {"type": 5, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 30, "id_jugador": 7}, 
        {"type": 6, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 31, "id_jugador": 7}, 
        {"type": 7, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 32, "id_jugador": 6}, 
        {"type": 8, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 33, "id_jugador": 6}, 
        {"type": 9, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 34, "id_jugador": 6}, 
        {"type": 10, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 35, "id_jugador": 6}, 
        {"type": 11, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 36, "id_jugador": 6}, 
        {"type": 12, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 37, "id_jugador": 6}, 
        {"type": 13, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 38, "id_jugador": 6}, 
        {"type": 14, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 39, "id_jugador": 6}, 
        {"type": 15, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 40, "id_jugador": 7}, 
        {"type": 16, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 41, "id_jugador": 7}, 
        {"type": 17, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 42, "id_jugador": 7}, 
        {"type": 18, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 43, "id_jugador": 6}, 
        {"type": 19, "id_partida": 6, "shown": True, "blocked": False, "id_figcard": 44, "id_jugador": 7}, 
        {"type": 20, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 45, "id_jugador": 6}, 
        {"type": 21, "id_partida": 6, "shown": True, "blocked": False, "id_figcard": 46, "id_jugador": 7}, 
        {"type": 22, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 47, "id_jugador": 6}, 
        {"type": 23, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 48, "id_jugador": 7}, 
        {"type": 24, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 49, "id_jugador": 6}, 
        {"type": 25, "id_partida": 6, "shown": False, "blocked": False, "id_figcard": 50, "id_jugador": 6},

        {"type": 1, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 101, "id_jugador": 11}, 
        {"type": 2, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 102, "id_jugador": 10}, 
        {"type": 3, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 103, "id_jugador": 11}, 
        {"type": 4, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 104, "id_jugador": None}, 
        {"type": 5, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 105, "id_jugador": None}, 
        {"type": 6, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 106, "id_jugador": 11}, 
        {"type": 7, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 107, "id_jugador": 11}, 
        {"type": 8, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 108, "id_jugador": 10}, 
        {"type": 9, "id_partida": 8, "shown": True, "blocked": False, "id_figcard": 109, "id_jugador": 10}, 
        {"type": 10, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 110, "id_jugador": 11}, 
        {"type": 11, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 111, "id_jugador": 10}, 
        {"type": 12, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 112, "id_jugador": 11}, 
        {"type": 13, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 113, "id_jugador": 11}, 
        {"type": 14, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 114, "id_jugador": 10}, 
        {"type": 15, "id_partida": 8, "shown": True, "blocked": False, "id_figcard": 115, "id_jugador": 10}, 
        {"type": 16, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 116, "id_jugador": 11}, 
        {"type": 17, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 117, "id_jugador": 10}, 
        {"type": 18, "id_partida": 8, "shown": True, "blocked": False, "id_figcard": 118, "id_jugador": 11}, 
        {"type": 19, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 119, "id_jugador": 11}, 
        {"type": 20, "id_partida": 8, "shown": True, "blocked": False, "id_figcard": 120, "id_jugador": 10}, 
        {"type": 21, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 121, "id_jugador": 10}, 
        {"type": 22, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 122, "id_jugador": 11}, 
        {"type": 23, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 123, "id_jugador": 10}, 
        {"type": 24, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 124, "id_jugador": 11}, 
        {"type": 25, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 125, "id_jugador": 11}, 
        {"type": 1, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 126, "id_jugador": 11}, 
        {"type": 2, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 127, "id_jugador": 11}, 
        {"type": 3, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 128, "id_jugador": 11}, 
        {"type": 4, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 129, "id_jugador": 10}, 
        {"type": 5, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 130, "id_jugador": 11}, 
        {"type": 6, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 131, "id_jugador": 11}, 
        {"type": 7, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 132, "id_jugador": 10}, 
        {"type": 8, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 133, "id_jugador": 10}, 
        {"type": 9, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 134, "id_jugador": 10}, 
        {"type": 10, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 135, "id_jugador": 10}, 
        {"type": 11, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 136, "id_jugador": 10}, 
        {"type": 12, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 137, "id_jugador": 10}, 
        {"type": 13, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 138, "id_jugador": 10}, 
        {"type": 14, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 139, "id_jugador": 10}, 
        {"type": 15, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 140, "id_jugador": 11}, 
        {"type": 16, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 141, "id_jugador": 11}, 
        {"type": 17, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 142, "id_jugador": 11}, 
        {"type": 18, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 143, "id_jugador": 10}, 
        {"type": 19, "id_partida": 8, "shown": True, "blocked": False, "id_figcard": 144, "id_jugador": 11}, 
        {"type": 20, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 145, "id_jugador": 10}, 
        {"type": 21, "id_partida": 8, "shown": True, "blocked": False, "id_figcard": 146, "id_jugador": 11}, 
        {"type": 22, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 147, "id_jugador": 10}, 
        {"type": 23, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 148, "id_jugador": 11}, 
        {"type": 24, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 149, "id_jugador": 10}, 
        {"type": 25, "id_partida": 8, "shown": False, "blocked": False, "id_figcard": 150, "id_jugador": 10}
    ]

    mensajes = [
        {"type":1, "id_mensaje": 1, "id_partida": 6, "autor": "player6", "mensaje": "Hola, soy el jugador 6",  'time': '2021-06-01 12:00:00', 'id_autor': 6},
        {"type":0,"id_mensaje": 2, "id_partida": 6, "autor": "Sistema", "mensaje": "El jugador 6 ha movido", 'time': '2021-06-01 12:00:00', 'id_autor': None},
    ]
    # Agregar partidas
    session = Session()
    try:
        if session.query(Game).count() == 0:
            for id_partida, name, cant_jugadores, started, is_private, password, turn, id_tablero in games:
                game = Game(id_partida=id_partida, name=name, cant_jugadores=cant_jugadores, started=started, is_private=is_private, password=password, turn=turn, id_tablero=id_tablero)
                session.add(game)
            session.commit()
    finally:
        session.close() 

    session = Session()
    try:
        if session.query(User).count() == 0:
            for id_user, nombre in users:
                user = User(id_user = id_user, nombre =nombre)
                session.add(user)
            session.commit()
    finally:
        session.close()
    
    # Agregar jugadores
    session = Session()
    try:
        if session.query(Player).count() == 0:
            for id_jugador, nombre, in_game, blocked, position, id_partida in players:
                player = Player(id_jugador=id_jugador, nombre=nombre, in_game=in_game, blocked=blocked, position=position, id_partida=id_partida)
                session.add(player)
            session.commit()
    finally:
        session.close()

    # Agregar movcards
    session = Session()
    try:
        if session.query(MovCard).count() == 0:
            for movcard in movcards:
                new_movcard = MovCard(id_partida=movcard["id_partida"], id_movcard=movcard["id_movcard"], type=movcard["type"], id_jugador=movcard["id_jugador"], state=movcard["state"])
                session.add(new_movcard)
            session.commit()
    finally:
        session.close()

    # Agregar tableros
    session = Session()
    try: 
        if session.query(Tablero).count() == 0:
            for color_prohibido, id_tablero in tableros:
                tablero = Tablero(color_prohibido=color_prohibido, id_tablero=id_tablero)
                for casilla in casillas:
                    if casilla["id_tablero"] == id_tablero:
                        new_casilla = Casilla(
                            color=casilla["color"],
                            id_casilla=casilla["id_casilla"],
                            fila=casilla["fila"],
                            columna=casilla["columna"],
                            id_tablero=casilla["id_tablero"]
                        )
                        tablero.casillas.append(new_casilla)
                session.add(tablero)
            session.commit()
    finally:
        session.close()
    
    
# Agregar figcards
    session = Session()
    try:
        if session.query(FigCard).count() == 0:
            for movcard in figcards:
                new_movcard = FigCard(type=movcard["type"], id_partida=movcard["id_partida"], shown=movcard["shown"], blocked=movcard["blocked"], id_figcard=movcard["id_figcard"], id_jugador=movcard["id_jugador"])
                session.add(new_movcard)
            session.commit()
    finally:
        session.close()
        
    session = Session()


    try:
        if session.query(Mensaje).count() == 0:
            for message in mensajes:
                message_time = datetime.strptime(message["time"], '%Y-%m-%d %H:%M:%S')
                new_message = Mensaje(id_mensaje=message["id_mensaje"], type=message['type'], id_partida=message["id_partida"], autor=message["autor"], mensaje=message["mensaje"], time=message_time, id_autor=message["id_autor"])
                session.add(new_message)
            session.commit()
    finally:
        session.close()

if __name__ == '__main__':
    load_data_for_test()            