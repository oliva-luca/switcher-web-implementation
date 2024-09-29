from sqlalchemy.orm import sessionmaker
from models import Game, engine, Player


Session = sessionmaker(bind=engine)

def load_data_for_test():
    games = [
        (1, 'game1', 2, False, False, 'as', 1),
        (2, 'game2', 3, True, False, 'as', 2),
        (3, 'game3', 4, False, False, 'as', 3),
        (4, 'game4', 3, False, False, 'as', 4),
        (5, 'game5', 2, False, False, 'as', 5),
    ]
    
    players =[
        (1, 'player1', False, False, False, None),
        (2, 'player2', False, False, False, None),
        (3, 'player3', False, False, False, None),
        (4, 'player4', False, False, False, None),
        (5, 'player5', False, False, False, None),
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
    
    try:
        if session.query(Player).count() == 0:
            for id_jugador, nombre, in_game, block, turn, id_partida in players:
                player = Player(id_jugador=id_jugador, nombre=nombre, in_game=in_game, block=block, turn=turn, id_partida=id_partida)
                session.add(player)
            session.commit()
    finally:
        session.close()
    
    
if __name__ == '__main__':
    load_data_for_test()