from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import NoResultFound

from models import Game, Player, Tablero, Casilla, MovCard, FigCard, engine
from typing import List,Dict


from random    import shuffle
from fastapi   import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect
from exception import * 
from utils     import * 
from websockts import * 

Session = sessionmaker(bind = engine)

manager = ConnectionManager()

manager_game = GameConnectionManager()

class Operations: 

    def get_games(self):
        session = Session()
        try:
            games = session.query(Game).all()  # Obtener todos los juegos de la base de datos
            for game in games:
                game.players = game.players
            for game in games:
                game.movcards = game.movcards
            for game in games:
                game.figcards = game.figcards
            return games
        finally:
            session.close()

    async def create_game(self,name: str, cant_jugadores: int, private: bool, password: str):
        # Crear una sesión de la base de datos
        session = Session()
        try:
            # Crear una nueva instancia de Game con el tablero en NULL
            new_game_entry = Game(
                name=name,
                cant_jugadores=cant_jugadores,
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

            # Enviar una señal por WebSocket a todos los clientes conectados
            await manager.broadcast("new game created")

            # Devolver el ID y el nombre del juego recién creado
            return new_game_entry.id_partida

        finally:
            # Cerrar la sesión para liberar los recursos
            session.close()


    async def join_game(self,game_id: int, player_id: int):
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
                raise PlayerNotFoundError(f"Player with id {player_id} not found.")

            if not game.players:
                game.owner = new_player.id_jugador

            # Asociar el jugador a la partida
            game.players.append(new_player)
            
            new_player.id_partida = game.id_partida

            # Marcar el jugador como 'in_game'
            new_player.in_game = True

            # Guardar los cambios
            session.commit()  # ¡IMPORTANTE! Guardar los cambios en la base de datos.

            # Notificar que un jugador se unió
            await manager.broadcast("player join")
            await manager_game.broadcast(game_id, "Player has joined the game")
            # Devolver respuesta exitosa
            return new_player.id_jugador

        finally:
            session.close()  # Cerrar la sesión para liberar recursos
    
    def get_board_by_id(self, game_id: int):

        session = Session()
        try:
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if game is None:
                return {"error": "Partida no encontrada"}

            # Si la partida no tiene tablero
            if game.id_tablero is None:
                return {"error": "La partida no tiene un tablero asignado"}
            try:
                tablero = session.query(Tablero).filter(Tablero.id_tablero == game.id_tablero).one_or_none()
                if tablero is None:
                    return {"error": "Tablero no encontrado"}
                tablero.casillas = session.query(Casilla).filter(Casilla.id_tablero == tablero.id_tablero).all()
            finally:
                session.close()
            return tablero
        finally:
            session.close()

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

    async def start_game(self,game_id: int):
            session = Session()
            try:
                # Buscar la partida por su ID
                game = session.query(Game).filter(Game.id_partida == game_id).first()
                
                # Verificar si la partida existe
                if not game:
                    raise GameNotFoundError(f"Game with ID {game_id} not found.")
                
                # Verificar si la partida ya ha comenzado
                if game.started:
                    raise GameStartedError(f"Game already on course.")
                
                # Verificar si la cantidad de jugadores es correcta
                if(len(game.players) != game.cant_jugadores):
                    raise NumberOfPlayersError(f"Game with ID {game_id} needs {game.cant_jugadores} "\
                                                f"players to start, but {len(game.players)} found")

                # Crear un nuevo tablero para la partida
                nuevo_tablero = Tablero()
                session.add(nuevo_tablero)
                session.commit()  # Guardar el tablero y obtener su id
                session.refresh(nuevo_tablero)
                
                # Asignar el tablero a la partida
                game.id_tablero = nuevo_tablero.id_tablero
                game.started = True  # Marcar que la partida ha comenzado
                session.commit()  # Guardar los cambios en la partida
                
                # Generar los casilleros y asignar colores aleatorios al tablero
                generar_tablero_aleatorio(nuevo_tablero.id_tablero, session)
                
                # Asignar las posiciones de los jugadores en la ronda
                asignar_posiciones(game_id, session)

                # Indicar que es el turno del primer jugador
                asignar_turno_primer_jugador(game_id, session)

                # Crear las cartas de movimiento de la partida
                crear_cartas_movimiento(game_id, session)
                
                # Repartir cartas de movimiento entre los jugadores
                players = session.query(Player).filter(Player.id_partida == game_id).all()
                for player in players:
                    repartir_cartas_movimiento(game_id, player.id_jugador, session)
                
                # Crear las cartas de figura de la partida
                crear_cartas_figura(game_id, session)

                # Repartir cartas de figura entre los jugadores
                repartir_cartas_figura(game_id, session)

                # Hacer visibles tres cartas de figura de cada uno de ellos
                players = session.query(Player).filter(Player.id_partida == game_id).all()
                for player in players:
                    mostrar_cartas_figura(player.id_jugador, session)

                await manager_game.broadcast(game_id, "Game has started")
                await manager.broadcast("game start")
                return {"message": f"Game {game_id} has started successfully!"}
            finally:
                session.close()

    async def end_turn(self, game_id: int):
        session = Session()
        try:
            # Obtengo la partida
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            
            # Verificar si la partida existe
            if not game:
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            
            # Verificar si la partida no ha comenzado
            if not game.started:
                raise GameNotStartedError(f"Game {game_id} has not started yet.")

            # Obtengo el jugador actual
            current_player = session.query(Player).filter(Player.id_jugador == game.turn).first()

            # Le revelo cartas de figura hasta tener tres (si le quedan suficientes)
            mostrar_cartas_figura(current_player.id_jugador, session)

            # Le reparto sus cartas de movimiento faltantes
            repartir_cartas_movimiento(game_id, current_player.id_jugador, session)

            
            # Calculo la posicion del proximo jugador
            next_player_position = (current_player.position + 1) % game.cant_jugadores

            # Obtengo el siguiente jugador
            next_player = session.query(Player).filter((Player.id_partida == game_id) & 
                                                       (Player.position == next_player_position)).first()
            while (next_player is None):
                next_player_position = (next_player_position + 1) % game.cant_jugadores
                next_player = session.query(Player).filter((Player.id_partida == game_id) & 
                                                           (Player.position == next_player_position)).first()
            # Actualizo la informacion del turno actual
            game.turn = next_player.id_jugador

            session.commit()
            
            await manager_game.broadcast(game_id, "Turno del jugador")
            return {"message": f"In game {game_id}, turn of player {current_player.id_jugador} ({current_player.nombre}) ended successfully"}
        finally:
            session.close()

    def get_game(self, game_id: int):
        session = Session()
        try:
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game:
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            game.players = game.players
            game.movcards = game.movcards
            game.figcards = game.figcards
            return game
        finally:
            session.close()

    def get_player(self, player_id: int):
        session = Session()
        try:
            player = session.query(Player).filter(Player.id_jugador == player_id).first()
            if not player:
                raise PlayerNotFoundError(f"Player with ID {player_id} not found.")
            player.game = player.game
            player.movcards = player.movcards
            player.figcards = player.figcards
            return player
        finally:
            session.close()    
                
           
    async def leave_lobby(self, player_id: int): 
        session = Session()
        try:
            player = session.query(Player).filter(Player.id_jugador == player_id).first()
            if not player:
                raise PlayerNotFoundError(f"Player with ID {player_id} not found.")

            game = session.query(Game).filter(Game.id_partida == player.id_partida).first()

            if game.owner == player.id_jugador:
                for player_i in game.players: 
                    player_i.in_game=False
                session.delete(game)

            player.id_partida = None
            player.in_game = False
            session.commit()

            await manager.broadcast("player leave")
            await manager_game.broadcast(game.id_partida, "Player has left the lobby")
            return {"message": f"Player {player_id} has left the lobby"}
        finally:
            session.close()
  
            
         
    async def leave_game(self, player_id: int):
        session = Session()
        try:
            player = session.query(Player).filter(Player.id_jugador == player_id).first()
            if not player:
                raise PlayerNotFoundError(f"Player with ID {player_id} not found.")

            
            game = session.query(Game).filter(Game.id_partida == player.id_partida).first()
            if game.turn == player_id:
                self.end_turn(player.id_partida)
                
            id_game = player.id_partida
            player.in_game = False
            player.id_partida = None
            
            for movcard in player.movcards:
                movcard.id_jugador = None
            for figcard in player.figcards:
                figcard.id_jugador = None
                figcard.shown = False
                
            # Contar cuántos jugadores quedan en la partida
            remaining_players = session.query(Player).filter(Player.id_partida == id_game, Player.in_game == True).count()
            session.commit()
            if remaining_players == 1:
                await manager_game.broadcast(id_game, "winner")
            else:
                await manager_game.broadcast(id_game, "Player has left the game") 
            return {"message": f"Player {player_id} has left the game"}
        finally:
            session.close()

    def playmovcard(self , game_id : int , mov_card_id : int , casilla_id1 : int, casilla_id2 : int):
        session = Session()

        try: 
            
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game: 
                raise GameNotFoundError(f"Game with ID {game_id} not found.")

            mov_card = session.query(MovCard).filter(MovCard.id_movcard == mov_card_id).first()
            if not mov_card: 
                raise CardNotFoundError(f"MovCard with ID {mov_card_id} not found.")

            player = mov_card.player

            if game.turn != player.id_jugador:
                raise NotTheirTurnError(f"Player with ID {player.id_jugador} doesnt have the turn.")
            
            mov_card.id_jugador = None 
            session.commit()

        finally:
            session.close()
            
