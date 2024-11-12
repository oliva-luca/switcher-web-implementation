from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import NoResultFound


from models import Game, Player, User , Tablero, Casilla, MovCard, FigCard, engine, Mensaje
from typing import List,Dict


from random    import shuffle
from fastapi   import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect
from exception import * 
from utils     import * 
from websockts import * 
from datetime  import datetime

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

    def get_users(self):
        session = Session()
        try: 
            users = session.query(User).all()
            for user in users:
                user.players = user.players
            return users
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


    async def join_game(self,game_id: int, user_id: int):
        # Crear una sesión de la base de datos
        session = Session()
        
        try:
            # Verificar si la partida existe
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game:
                raise GameNotFoundError(f"Game with ID {game_id} not found.")

            user = session.query(User).filter(User.id_user == user_id).first()
            if not user:
                raise UserNotFoundError(f"User with id {user_id} not found.")

            

            new_player_id = create_player( user_id, session) 
            
            # Verificar si el jugador existe
            new_player = session.query(Player).filter(Player.id_jugador == new_player_id).first()
            if not new_player:
                raise PlayerNotFoundError(f"Player with id {new_player_id} not found.")

            # Verficar si el jugador ya está en alguna partida
            #if new_player.id_partida != None:
            #    raise PlayerAlreadyInGameError(f"Player with id {player_id} is already in game {game_id}.")

            if not game.players:
                game.owner = new_player.id_jugador

            # Asociar el jugador a la partida
            game.players.append(new_player)
            
            new_player.id_partida = game.id_partida

            # Marcar el jugador como 'in_game'
            new_player.in_game = True


            #Por si el jugador tiene cartas de anteriores partidas se borran 
            if new_player.movcards is not None:
                for movcard in new_player.movcards:
                    movcard.id_jugador = None


            if new_player.figcards is not None:
                for figcard in new_player.figcards:
                    figcard.id_jugador = None
                    
            new_log = Mensaje(
                type=0,
                autor = f"{new_player.nombre}",
                mensaje="Se ha unido a la partida",
                id_partida=game_id,
                time = datetime.now(),
                id_autor = new_player.id_jugador
            )
            session.add(new_log)
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
            response = tablero.to_dict()
            if 'id_tablero' not in response:
                print("Error: id_tablero not found in response")
            return response
        finally:
            session.close()

    def create_user(self, nombre: str):
        session = Session()

        try: 
            new_user_entry = User (
                nombre = nombre 
            )

            session.add(new_user_entry)
            session.commit()
            session.refresh(new_user_entry)
            return {
                'id': new_user_entry.id_user,
                'name': new_user_entry.nombre,
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
        
                # Identificar las figuras en las casillas
                actualizar_informacion_casillas(game_id, nuevo_tablero, session)

                # Actualizo el tiempo del turno
                game.turn_time = datetime.now()
                
                new_log = Mensaje(
                type=0,
                autor = "Sistema",
                mensaje="La partida ha comenzado",
                id_partida=game_id,
                time = datetime.now(),
                id_autor = None
                )
                session.add(new_log)
                
                session.commit()

                await manager_game.broadcast(game_id, "Game has started")
                await manager.broadcast("game start")
                return {"message": f"Game {game_id} has started successfully!"}
            finally:
                session.close()

    async def start_game_just_one_figcard(self,game_id: int):
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
                repartir_una_carta_figura(game_id, session)

                # Hacer visible la carta de figura de cada uno de ellos
                players = session.query(Player).filter(Player.id_partida == game_id).all()
                for player in players:
                    mostrar_cartas_figura(player.id_jugador, session)
        
                # Identificar las figuras en las casillas
                actualizar_informacion_casillas(game_id, nuevo_tablero, session)

                # Actualizo el tiempo del turno
                game.turn_time = datetime.now()

                session.commit()

                await manager_game.broadcast(game_id, "Game has started")
                await manager.broadcast("game start")
                return {"message": f"Game {game_id} has started successfully!"}
            finally:
                session.close()


    async def end_turn(self, game_id: int):
        await self.cancel_partial_moves(game_id)
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

            
            for movcard in current_player.movcards:
                if movcard.state == True:
                    movcard.state = False
            

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
            
            # Registro nuevo turno
            new_log = Mensaje(
                type=0,
                autor = "Sistema",
                mensaje=f"Turno del jugador {next_player.nombre}",
                id_partida=game_id,
                time = datetime.now(),
                id_autor = None
            )
            session.add(new_log)
            session.commit()
            # Recalculo la informacion de las casillas
            actualizar_informacion_casillas(game_id, game.tablero, session)

            # Actualizo el tiempo del turno
            game.turn_time = datetime.now()

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

            if not game:
                raise GameNotFoundError(f"Game with ID {player.id_partida} not found.")

            if(game.owner != player.id_jugador):
                new_log = Mensaje(
                    type=0,
                    autor = f"{player.nombre}",
                    mensaje="Se ha ido del lobby",
                    id_partida=game.id_partida,
                    time = datetime.now(),
                    id_autor = player.id_jugador
                )
                session.add(new_log)
                session.commit()
            
            if game.owner == player.id_jugador:
                for player_i in game.players: 
                    player_i.id_partida = None
                    player_i.in_game=False
                await manager_game.broadcast(game.id_partida, "Owner cancelled the game")
                await manager.broadcast("Owner cancelled the game")
                for mensaje in game.mensajes:
                    session.delete(mensaje)
                session.delete(game)
                session.commit()
                session.close()
                return {"message": f"Game cancelled"}

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
                await self.end_turn(player.id_partida)
                
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
            remaining_player = session.query(Player).filter(Player.id_partida == id_game).first()
            new_log = Mensaje(
                type=0,
                autor = f"{player.nombre}",
                mensaje="Se ha ido de la partida",
                id_partida=id_game,
                time = datetime.now(),
                id_autor = player.id_jugador
            )
            session.add(new_log)
            session.commit()
            if remaining_players == 1:
                remaining_player.id_partida = None
                session.commit()
                await manager.broadcast("Somebody won")
                await manager_game.broadcast(id_game, f"winner {remaining_player.id_jugador}")
                session.delete(game)
                session.commit()
            else:
                await manager_game.broadcast(id_game, "Player has left the game") 
            return {"message": f"Player {player_id} has left the game"}
        finally:
            session.close()

    async def playmovcard(self , game_id : int , mov_card_id : int , casilla_id1 : int, casilla_id2 : int):
        session = Session()

        try: 
            
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game: 
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            
            mov_card = session.query(MovCard).filter(MovCard.id_movcard == mov_card_id).first()
            if not mov_card: 
                raise CardNotFoundError(f"MovCard with ID {mov_card_id} not found.")

            player = mov_card.player
            
            if not player:
                raise PlayerNotFoundError(f"Player associated with MovCard ID {mov_card_id} not found.")
            
            if game.turn != player.id_jugador:
                raise NotTheirTurnError(f"Player with ID {player.id_jugador} doesnt have the turn.")
            
            casilla_1 = session.query(Casilla).filter(Casilla.id_casilla == casilla_id1).first()
            if not casilla_1:
                raise CasillaNotFoundError(f"Casilla with ID {casilla_id1} not found.")
            
            casilla_2 = session.query(Casilla).filter(Casilla.id_casilla == casilla_id2).first()
            if not casilla_2:
                raise CasillaNotFoundError(f"Casilla with ID {casilla_id2} not found.")

            modificates.add_modify(game.id_tablero,mov_card_id,casilla_id1,casilla_id2)

            mov_card.state = True

            tablero = session.query(Tablero).filter(Tablero.id_tablero == game.id_tablero).one()      

            modificaciones = modificates.get_game_modifies(tablero.id_tablero)

            actualizar_informacion_casillas(game_id, tablero, session, modificaciones)

            new_log = Mensaje(
                type=0,
                autor = f"{player.nombre}",
                mensaje=f"Ha intercambiado la ficha en fila {casilla_1.fila+1} columna {casilla_1.columna+1} con la ficha en fila {casilla_2.fila+1} columna {casilla_2.columna+1}",
                id_partida=game.id_partida,
                time = datetime.now(),
                id_autor = player.id_jugador
            )
            session.add(new_log)
            
            session.commit()

            await manager_game.broadcast(game_id, "Board change") 

        finally:
            session.close()
            

    async def discard_figcard(self, game_id : int, figcard_id : int, color : str):
        session = Session()

        try: 
            
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game: 
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            
            figcard = session.query(FigCard).filter((FigCard.id_figcard == figcard_id) &
                                                    (FigCard.id_partida == game_id)).first()
            if not figcard: 
                raise CardNotFoundError(f"FigCard with ID {figcard_id} not found.")

            player = figcard.player
            
            if not player:
                raise PlayerNotFoundError(f"Player associated with FigCard ID {figcard_id} not found.")
            
            if not figcard.shown:
                raise InvalidCardError(f"FigCard with ID {figcard_id} is not shown.")
            
            if game.turn != player.id_jugador:
                raise NotTheirTurnError(f"Player with ID {player.id_jugador} doesnt have the turn.")
            figcard.id_jugador = None
            figcard.shown = False
            figcard.blocked = False
            await confirmar_cambios(session, game.id_tablero)

            actualizar_informacion_casillas(game_id, game.tablero, session)

            game.tablero.color_prohibido = color
            
            new_log = Mensaje(
                type=0,
                autor = f"{player.nombre}",
                mensaje="Ha descartado una carta de figura",
                id_partida=game.id_partida,
                time = datetime.now(),
                id_autor = player.id_jugador
            )
            session.add(new_log)

            # Detectar si descartó la unica bloqueada que tenía
            # El chequeo de que sea valida de jugar se hace desde el front
            number_of_shown_figcards = session.query(FigCard).filter((FigCard.id_jugador == player.id_jugador)
                                                                     & FigCard.shown).count()
            if number_of_shown_figcards == 0 and player.blocked:
                # Debe ser desbloqueado
                player.blocked = False

            if number_of_shown_figcards == 1 and player.blocked:
                last_figcard = session.query(FigCard).filter((FigCard.id_jugador == player.id_jugador) & FigCard.shown).first() 
                # Debe ser desbloqueado
                last_figcard.blocked = False
            
            session.commit()

            # Detectar si el jugador que descartó esta carta ganó
            number_of_figcards = session.query(FigCard).filter(FigCard.id_jugador == player.id_jugador).count()

            if number_of_figcards == 0:
                for player in game.players:
                    player.id_partida = None
                session.commit()
                await manager_game.broadcast(game_id, f"winner {player.id_jugador}")
            await manager_game.broadcast(game_id, "discard figcard") 

            return {"message": f"Figcard {figcard_id} from player {player.id_jugador} in game {game_id} was discarded"}
        
        finally:
            session.close()

    async def block_figcard(self, game_id : int, figcard_id : int, color : str):
        session = Session()

        try: 
            
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game: 
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            
            figcard = session.query(FigCard).filter((FigCard.id_figcard == figcard_id) &
                                                    (FigCard.id_partida == game_id)).first()
            if not figcard: 
                raise CardNotFoundError(f"FigCard with ID {figcard_id} not found.")

            player = figcard.player
            
            if not player:
                raise PlayerNotFoundError(f"Player associated with FigCard ID {figcard_id} not found.")
            
            if not figcard.shown:
                raise InvalidCardError(f"FigCard with ID {figcard_id} is not shown.")
            
            if game.turn == player.id_jugador:
                raise InvalidBlockError(f"Player with ID {player.id_jugador} cannot block theirself.")
        
            if player.blocked:
                raise InvalidBlockError(f"Player with ID {player.id_jugador} is already blocked.")
            
            number_of_figcards = session.query(FigCard).filter(FigCard.id_jugador == player.id_jugador).count()
            
            # El jugador no puede ser bloqueado si le quedan menos de 3 figcards
            if number_of_figcards < 3:
                raise InvalidBlockError(f"Player with ID {player.id_jugador} has less than three figcards.")
            
            
            player.blocked = True
            figcard.blocked = True
            await confirmar_cambios(session, game.id_tablero)

            actualizar_informacion_casillas(game_id, game.tablero, session)

            game.tablero.color_prohibido = color
            
            new_log = Mensaje(
                type=0,
                autor = f"{player.nombre}",
                mensaje="Ha bloqueado una carta de figura",
                id_partida=game.id_partida,
                time = datetime.now(),
                id_autor = player.id_jugador
            )
            session.add(new_log)
            session.commit()

            await manager_game.broadcast(game_id, "Block card")

            return {"message": f"Figcard {figcard_id} from player {player.id_jugador} in game {game_id} was blocked"}
        
        finally:
            session.close()

    async def cancel_partial_moves(self , game_id :int):
        session = Session()
        try:
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if game is None:
                raise GameNotFoundError(f"The game with id:{game_id} does not exist.")
        
            current_player = session.query(Player).filter(Player.id_jugador == game.turn).one()

            tablero = session.query(Tablero).filter(Tablero.id_tablero == game.id_tablero).one()

            modificates.clear_modifies(game.id_tablero)

            for movcard in current_player.movcards:
                if movcard.state == True:
                    movcard.state = False

            for casilla in tablero.casillas:
                casilla.figura = - 1

            actualizar_informacion_casillas(game_id, tablero, session)
            new_log = Mensaje(
                type=0,
                autor = f"{current_player.nombre}",
                mensaje="Se han cancelado los movimientos parciales",
                id_partida=game.id_partida,
                time = datetime.now(),
                id_autor = current_player.id_jugador
            )
            session.add(new_log)
            session.commit()
            
            await manager_game.broadcast(game_id, "The partial moves has been cancelled") 

            return {"message": f"The partial moves has been cancelled"} 

        finally: 
            session.close()
    
    async def send_message(self, game_id: int, player_id: int, mensaje: str):
        session = Session()
        try:
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game:
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            
            player = session.query(Player).filter(Player.id_jugador == player_id).first()
            if not player:
                raise PlayerNotFoundError(f"Player with ID {player_id} not found.")
            
            new_msj = Mensaje(
                type=1,
                autor = f"{player.nombre}",
                mensaje=mensaje,
                id_partida=game_id,
                time = datetime.now(),
                id_autor = player_id
            )
            session.add(new_msj)
            session.commit()
            await manager_game.broadcast(game_id, "MENSAJE")
            return {"message": f"Message sent by player {player_id} in game {game_id}"}
        finally:
            session.close()
    
    def get_turn_time(self, game_id: int):
        session = Session()
        try:
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game:
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            diff = int((datetime.now() - game.turn_time).total_seconds())
            return diff
        finally:
            session.close()

    def get_logs(self, game_id: int):
        session = Session()
        try:
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game:
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            logs = []
            for msj in game.mensajes:
                if msj.type == 0:
                    logs.append(msj)
            return logs
        finally:
            session.close()
            
    def get_chat(self, game_id: int):
        session = Session()
        try:
            game = session.query(Game).filter(Game.id_partida == game_id).first()
            if not game:
                raise GameNotFoundError(f"Game with ID {game_id} not found.")
            chat = []
            for msj in game.mensajes:
                if msj.type == 1:
                    chat.append(msj)
            return chat
        finally:
            session.close()