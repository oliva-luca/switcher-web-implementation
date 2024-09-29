from sqlalchemy.orm import sessionmaker
from models import Game, engine


Session = sessionmaker(bind=engine)

def load_data_for_test():
    games = [
        (1, 'game1', 2, False, False, 'as', 1),
        (2, 'game2', 3, False, False, 'as', 2),
        (3, 'game3', 4, False, False, 'as', 3),
        (4, 'game4', 3, False, False, 'as', 4),
        (5, 'game5', 2, False, False, 'as', 5),
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
    
    
if __name__ == '__main__':
    load_data_for_test()