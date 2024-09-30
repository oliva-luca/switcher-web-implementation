from sqlalchemy.orm import sessionmaker
from models import Game, engine, Player, Tablero, Casilla


Session = sessionmaker(bind=engine)

def load_data_for_test():
    games = [
        (1, 'game1', 2, False, False, 'as', 1),
        (2, 'game2', 3, True, False, 'as', None),
        (3, 'game3', 4, False, False, 'as', None),
        (4, 'game4', 3, False, False, 'as', None),
        (5, 'game5', 2, False, False, 'as', None),
    ]
    
    players =[
        (1, 'player1', False, False, False, None),
        (2, 'player2', False, False, False, None),
        (3, 'player3', False, False, False, None),
        (4, 'player4', False, False, False, None),
        (5, 'player5', False, False, False, None),
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


    session = Session()
    try:    
        if session.query(Game).count() == 0:
            for id_partida, name, cant_jugadores, started, is_private, password, id_tablero in games:
                game = Game(id_partida=id_partida, name=name, cant_jugadores=cant_jugadores, started=started, is_private=is_private, password=password, id_tablero=id_tablero)
                session.add(game)
            session.commit()
    finally:
        session.close() 
    
    session = Session()
    
    try:
        if session.query(Player).count() == 0:
            for id_jugador, nombre, in_game, block, turn, id_partida in players:
                player = Player(id_jugador=id_jugador, nombre=nombre, in_game=in_game, block=block, turn=turn, id_partida=id_partida)
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
    
    
if __name__ == '__main__':
    load_data_for_test()            