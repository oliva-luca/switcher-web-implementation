from sqlalchemy.orm import sessionmaker
from models import Game, engine, Player, Tablero


Session = sessionmaker(bind=engine)

def load_data_for_test():
    games = [
        (1, 'game1', 2, False, False, 'as', None),
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


    casillas = [{
      "verde",
      1,
      0,
      0,
      1
    },
    {
      "amarillo",
      2,
      0,
      1,
      1
    },
    {
      "rojo",
      3,
      0,
      2,
      1
    },
    {
      "azul",
      4,
      0,
      3,
      1
    },
    {
      "amarillo",
      5,
      0,
      4,
      1
    },
    {
      "amarillo",
      6,
      0,
      5,
      1
    },
    {
      "amarillo",
      7,
      1,
      0,
      1
    },
    {
      "amarillo",
      8,
      1,
      1,
      1
    },
    {
      "amarillo",
      9,
      1,
      2,
      1
    },
    {
      "azul",
      10,
      1,
      3,
      1
    },
    {
      "verde",
      11,
      1,
      4,
      1
    },
    {
      "verde",
      12,
      1,
      5,
      1
    },
    {
      "azul",
      13,
      2,
      0,
      1
    },
    {
      "rojo",
      14,
      2,
      1,
      1
    },
    {
      "azul",
      15,
      2,
      2,
      1
    },
    {
      "verde",
      16,
      2,
      3,
      1
    },
    {
      "rojo",
      17,
      2,
      4,
      1
    },
    {
      "rojo",
      18,
      2,
      5,
      1
    },
    {
      "azul",
      19,
      3,
      0,
      1
    },
    {
      "verde",
      20,
      3,
      1,
      1
    },
    {
      "azul",
      21,
      3,
      2,
      1
    },
    {
      "rojo",
      22,
      3,
      3,
      1
    },
    {
      "amarillo",
      23,
      3,
      4,
      1
    },
    {
      "rojo",
      24,
      3,
      5,
      1
    },
    {
      "verde",
      25,
      4,
      0,
      1
    },
    {
      "verde",
      26,
      4,
      1,
      1
    },
    {
      "rojo",
      27,
      4,
      2,
      1
    },
    {
      "azul",
      28,
      4,
      3,
      1
    },
    {
      "amarillo",
      29,
      4,
      4,
      1
    },
    {
      "verde",
      30,
      4,
      5,
      1
    },
    {
      "azul",
      31,
      5,
      0,
      1
    },
    {
      "rojo",
      32,
      5,
      1,
      1
    },
    {
      "rojo",
      33,
      5,
      2,
      1
    },
    {
      "verde",
      34,
      5,
      3,
      1
    },
    {
      "amarillo",
      35,
      5,
      4,
      1
    },
    {
      "azul",
      36,
      5,
      5,
      1
    }


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
            for color_principal,id_tablero in tableros:     
                tablero = Tablero(color_principal=color_principal, id_tablero = id_tablero, casillas = casillas)
                session.add(tablero)
            session.commit()
    finally:
        session.close()
    
    
if __name__ == '__main__':
    load_data_for_test()