from sqlalchemy.orm import sessionmaker
from models import Game, engine, Player, FigCard, Tablero, Casilla


Session = sessionmaker(bind=engine)

def load_data_for_test():
    games = [
        (1, 'game1', 1, False, False, 'as', None, 1),
        (2, 'game2', 3, True, False, 'as', None, None),
        (3, 'game3', 4, False, False, 'as', None, None),
        (4, 'game4', 3, False, False, 'as', None, None),
        (5, 'game5', 2, True, False, 'as', 4, None),
    ]
    
    players = [
        (1, 'player1', False, False, None, None),
        (2, 'player2', False, False, None, None),
        (3, 'player3', False, False, None, None),
        (4, 'player4', False, False, 0, 5),
        (5, 'player5', False, False, 1, 5),
    ]

    tableros = [( None, 1 )]
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
        {"color": "azul", "id_casilla": 36, "fila": 5, "columna": 5, "id_tablero": 1}
    ]


    figcards = [
        {"type": 1, "id_partida": 6, "shown": False, "id_figcard": 1, "id_jugador": 7}, 
        {"type": 2, "id_partida": 6, "shown": False, "id_figcard": 2, "id_jugador": 6}, 
        {"type": 3, "id_partida": 6, "shown": False, "id_figcard": 3, "id_jugador": 7}, 
        {"type": 4, "id_partida": 6, "shown": False, "id_figcard": 4, "id_jugador": 6}, 
        {"type": 5, "id_partida": 6, "shown": False, "id_figcard": 5, "id_jugador": 7}, 
        {"type": 6, "id_partida": 6, "shown": False, "id_figcard": 6, "id_jugador": 7}, 
        {"type": 7, "id_partida": 6, "shown": False, "id_figcard": 7, "id_jugador": 7}, 
        {"type": 8, "id_partida": 6, "shown": False, "id_figcard": 8, "id_jugador": 6}, 
        {"type": 9, "id_partida": 6, "shown": True, "id_figcard": 9, "id_jugador": 6}, 
        {"type": 10, "id_partida": 6, "shown": False, "id_figcard": 10, "id_jugador": 7}, 
        {"type": 11, "id_partida": 6, "shown": False, "id_figcard": 11, "id_jugador": 6}, 
        {"type": 12, "id_partida": 6, "shown": False, "id_figcard": 12, "id_jugador": 7}, 
        {"type": 13, "id_partida": 6, "shown": False, "id_figcard": 13, "id_jugador": 7}, 
        {"type": 14, "id_partida": 6, "shown": False, "id_figcard": 14, "id_jugador": 6}, 
        {"type": 15, "id_partida": 6, "shown": True, "id_figcard": 15, "id_jugador": 6}, 
        {"type": 16, "id_partida": 6, "shown": False, "id_figcard": 16, "id_jugador": 7}, 
        {"type": 17, "id_partida": 6, "shown": False, "id_figcard": 17, "id_jugador": 6}, 
        {"type": 18, "id_partida": 6, "shown": True, "id_figcard": 18, "id_jugador": 7}, 
        {"type": 19, "id_partida": 6, "shown": False, "id_figcard": 19, "id_jugador": 7}, 
        {"type": 20, "id_partida": 6, "shown": True, "id_figcard": 20, "id_jugador": 6}, 
        {"type": 21, "id_partida": 6, "shown": False, "id_figcard": 21, "id_jugador": 6}, 
        {"type": 22, "id_partida": 6, "shown": False, "id_figcard": 22, "id_jugador": 7}, 
        {"type": 23, "id_partida": 6, "shown": False, "id_figcard": 23, "id_jugador": 6}, 
        {"type": 24, "id_partida": 6, "shown": False, "id_figcard": 24, "id_jugador": 7}, 
        {"type": 25, "id_partida": 6, "shown": False, "id_figcard": 25, "id_jugador": 7}, 
        {"type": 1, "id_partida": 6, "shown": False, "id_figcard": 26, "id_jugador": 7}, 
        {"type": 2, "id_partida": 6, "shown": False, "id_figcard": 27, "id_jugador": 7}, 
        {"type": 3, "id_partida": 6, "shown": False, "id_figcard": 28, "id_jugador": 7}, 
        {"type": 4, "id_partida": 6, "shown": False, "id_figcard": 29, "id_jugador": 6}, 
        {"type": 5, "id_partida": 6, "shown": False, "id_figcard": 30, "id_jugador": 7}, 
        {"type": 6, "id_partida": 6, "shown": False, "id_figcard": 31, "id_jugador": 7}, 
        {"type": 7, "id_partida": 6, "shown": False, "id_figcard": 32, "id_jugador": 6}, 
        {"type": 8, "id_partida": 6, "shown": False, "id_figcard": 33, "id_jugador": 6}, 
        {"type": 9, "id_partida": 6, "shown": False, "id_figcard": 34, "id_jugador": 6}, 
        {"type": 10, "id_partida": 6, "shown": False, "id_figcard": 35, "id_jugador": 6}, 
        {"type": 11, "id_partida": 6, "shown": False, "id_figcard": 36, "id_jugador": 6}, 
        {"type": 12, "id_partida": 6, "shown": False, "id_figcard": 37, "id_jugador": 6}, 
        {"type": 13, "id_partida": 6, "shown": False, "id_figcard": 38, "id_jugador": 6}, 
        {"type": 14, "id_partida": 6, "shown": False, "id_figcard": 39, "id_jugador": 6}, 
        {"type": 15, "id_partida": 6, "shown": False, "id_figcard": 40, "id_jugador": 7}, 
        {"type": 16, "id_partida": 6, "shown": False, "id_figcard": 41, "id_jugador": 7}, 
        {"type": 17, "id_partida": 6, "shown": False, "id_figcard": 42, "id_jugador": 7}, 
        {"type": 18, "id_partida": 6, "shown": False, "id_figcard": 43, "id_jugador": 6}, 
        {"type": 19, "id_partida": 6, "shown": True, "id_figcard": 44, "id_jugador": 7}, 
        {"type": 20, "id_partida": 6, "shown": False, "id_figcard": 45, "id_jugador": 6}, 
        {"type": 21, "id_partida": 6, "shown": True, "id_figcard": 46, "id_jugador": 7}, 
        {"type": 22, "id_partida": 6, "shown": False, "id_figcard": 47, "id_jugador": 6}, 
        {"type": 23, "id_partida": 6, "shown": False, "id_figcard": 48, "id_jugador": 7}, 
        {"type": 24, "id_partida": 6, "shown": False, "id_figcard": 49, "id_jugador": 6}, 
        {"type": 25, "id_partida": 6, "shown": False, "id_figcard": 50, "id_jugador": 6}
    ]

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
        if session.query(Player).count() == 0:
            for id_jugador, nombre, in_game, block, position, id_partida in players:
                player = Player(id_jugador=id_jugador, nombre=nombre, in_game=in_game, block=block, position=position, id_partida=id_partida)
                session.add(player)
            session.commit()
    finally:
        session.close()

    
    session = Session()
    try: 
        if session.query(Tablero).count() == 0:
            for color_principal, id_tablero in tableros:
                tablero = Tablero(color_principal=color_principal, id_tablero=id_tablero)
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
                new_movcard = FigCard(type=movcard["type"], id_partida=movcard["id_partida"], shown=movcard["shown"], id_figcard=movcard["id_figcard"], id_jugador=movcard["id_jugador"])
                session.add(new_movcard)
            session.commit()
    finally:
        session.close()

if __name__ == '__main__':
    load_data_for_test()            