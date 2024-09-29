from sqlalchemy.orm import sessionmaker
from models import Game, Player, Tablero, Casilla, engine



Session = sessionmaker(bind = engine)
class Operations: 

    def get_games(self):
        session = Session()
        try:
            games = session.query(Game).all()  # Obtener todos los juegos de la base de datos
            for game in games:
                game.players = game.players
            return games
        finally:
            session.close()
