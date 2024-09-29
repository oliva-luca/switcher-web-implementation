from sqlalchemy.orm import sessionmaker
from models import Game, engine


Session = sessionmaker(bind=engine)

def load_data_for_test():
    games = [
        (0,'game_a',4,False,False,'skds',2),
        (1,'game_b',3,False,False,'skdadgfdsgdsfg',3),
        (2,'game_c',4,False,False,'skd226536s',4),
        (3,'game_d',3,False,False,'skds',5),
        (4,'game_e',4,False,False,'skds',1),
        (5,'game_f',4,False,False,'skds',6),
        (6,'game_g',2,False,False,'skds',7),
        (7,'game_h',4,False,False,'skds',8),
        (8,'game_i',2,False,False,'skds',9),
        (9,'game_j',4,False,False,'skds',11),
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