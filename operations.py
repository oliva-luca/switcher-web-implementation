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

    def create_game(self,name: str, cant_players: int, private: bool, password: str):
        # Crear una sesión de la base de datos
        session = Session()
        try:
            # Crear una nueva instancia de Game con el tablero en NULL
            new_game_entry = Game(
                name=name,
                cant_jugadores=cant_players,
                started=False,
                is_private=private,
                password=password,
                id_tablero=None  # El tablero aún no está asignado, así que se deja en NULL
            )

            # Agregar el nuevo juego a la sesión
            session.add(new_game_entry)
            # Guardar los cambios en la base de datos
            session.commit()
            # Refrescar la instancia para obtener el id generado automáticamente
            session.refresh(new_game_entry)

            # Devolver el ID y el nombre del juego recién creado
            return new_game_entry.id_partida

        finally:
            # Cerrar la sesión para liberar los recursos
            session.close()


    def join_game(self,game_id: int, player_id: int):
        # Crear una sesión de la base de datos
        session = Session()
        
        try:
            # Verificar si la partida existe
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game:
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            
            # Verificar si el jugador existe
            new_player = session.query(Player).filter(Player.id_jugador == player_id).first()
            if not new_player:
                raise PlayerNotFoundError(f"Player with name {player_name} not found.")
            
            # Asociar el jugador a la partida
            game.players.append(new_player)
            
            new_player.id_partida = game.id_partida

            # Marcar el jugador como 'in_game'
            new_player.in_game = True

            # Guardar los cambios
            session.commit()  # ¡IMPORTANTE! Guardar los cambios en la base de datos.

            # Devolver respuesta exitosa
            return new_player.id_jugador

        finally:
            session.close()  # Cerrar la sesión para liberar recursos
            
    def create_player(self, nombre: str):
        session = Session()
        try:
            new_player_entry = Player(
                nombre=nombre
            )
            session.add(new_player_entry)
            session.commit()
            session.refresh(new_player_entry)
            return {
                'id': new_player_entry.id_jugador,
                'name': new_player_entry.nombre,
                'operation_result': "Successfully created!"
            }
        finally:
            session.close()   