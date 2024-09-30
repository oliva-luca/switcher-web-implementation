from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import NoResultFound

from models import Game, Player, Tablero, Casilla, MovCard, FigCard, engine
from typing import List


from random import shuffle
from fastapi import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect

class GameNotFoundError(Exception):
    pass

class PlayerNotFoundError(Exception):
    pass

class GameStartedError(Exception):
    pass

class NumberOfPlayersError(Exception):
    pass

class GameNotStartedError(Exception):
    pass

Session = sessionmaker(bind = engine)


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

class GameConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, game_id: int, websocket: WebSocket):
        await websocket.accept()
        if game_id not in self.active_connections:
            self.active_connections[game_id] = []
        self.active_connections[game_id].append(websocket)

    def disconnect(self, game_id: int, websocket: WebSocket):
        if game_id in self.active_connections:
            self.active_connections[game_id].remove(websocket)
            if not self.active_connections[game_id]:
                del self.active_connections[game_id]

    async def broadcast(self, game_id: int, message: str):
        if game_id in self.active_connections:
            for connection in self.active_connections[game_id]:
                await connection.send_text(message)

manager_game = GameConnectionManager()


def generar_tablero_aleatorio(id_tablero: int):
    # Los 4 colores que se van a distribuir equitativamente
    colores = ['rojo', 'azul', 'verde', 'amarillo']
    # Crear una lista con 9 repeticiones de cada color para llenar el tablero
    lista_colores = colores * 9
    shuffle(lista_colores)  # Barajar los colores aleatoriamente
    # Crear los casilleros y asignar colores
    session = Session()
    try: 
        tablero = session.query(Tablero).filter(Tablero.id_tablero == id_tablero).first() 
        for fila in range(6):
            for columna in range(6):
                # Extraer un color de la lista barajada
                color = lista_colores.pop()
                # Crear un casillero en la posición (fila, columna) con el color asignado
                casilla = Casilla(
                    fila=fila,
                    columna=columna,
                    color=color,
                    id_tablero=id_tablero  # Relación con el tablero
                )
                session.add(casilla)
                tablero.casillas.append(casilla)
        session.commit()  # Guardar todos los casilleros en la base de datos
    finally:
        session.close()
    return {"message": "Tablero generado con éxito"}

def asignar_posiciones(id_partida: int):
    session = Session()
    try:
        # Obtengo la partida
        game = session.query(Game).filter(Game.id_partida == id_partida).first()
        # Obtengo los jugadores
        players = session.query(Player).filter(Player.id_partida == id_partida).all()
        # Sorteo las posiciones
        positions = list(range(game.cant_jugadores))
        shuffle(positions)
        # Asignar las posiciones
        for player in players:
            player.position = positions.pop()
        session.commit()
    finally:
        session.close()

    return {"message": "Asignadas posiciones de los jugadores con éxito"}


def asignar_turno_primer_jugador(id_partida: int):
    session = Session()
    try:
        # Obtengo la partida
        game = session.query(Game).filter(Game.id_partida == id_partida).first()
        # Obtengo el jugador
        first_player = session.query(Player).filter((Player.id_partida == id_partida) & 
                                                    (Player.position == 0)).first()
        
        # Indico que es su turno
        game.turn = first_player.id_jugador
        
        session.commit()
    finally:
        session.close()

    return {"message": "Turno del primer jugador asignado con éxito"}

def crear_cartas_movimiento(id_partida: int):
    # Cantidad de cartas de movimiento diferentes
    number_of_types = 7
    # Cantidad de repeticiones de cada carta
    repetitions = 7
    # Crear las 49 cartas y agregarlas
    session = Session()
    for _ in range(repetitions):
        for type in range(1, number_of_types+1):
            new_movcard = MovCard(
                type = type,
                id_partida = id_partida
            )
            session.add(new_movcard)
    session.commit()
    session.close()
    return {"message": "Creadas las cartas de movimiento de la partida"}



def repartir_cartas_movimiento(id_partida: int):
    session = Session()
    try:
        # Obtengo los jugadores de la partida
        players = session.query(Player).filter(Player.id_partida == id_partida).all()
        # Obtengo las cartas de movimienta de la partida
        movcards = session.query(MovCard).filter(MovCard.id_partida == id_partida).all()
        # Mezclo las cartas de movimiento
        shuffle(movcards)
        # Y las reparto entre los jugadores
        for player in players:
            # Elegir 3 cartas
            for _ in range(3):
                new_movcard = movcards.pop()
                new_movcard.id_jugador = player.id_jugador
        session.commit()
    finally:
        session.close()

    return {"message": "Repartidas las cartas de movimiento"}

def crear_cartas_figura(id_partida: int):
    # Cantidad de cartas de figura diferentes
    number_of_types = 25
    # Cantidad de repeticiones de cada carta
    repetitions = 2
    # Crear las 50 cartas y agregarlas
    session = Session()
    for _ in range(repetitions):
        for type in range(1, number_of_types+1):
            new_figcard = FigCard(
                type = type,
                id_partida = id_partida
            )
            session.add(new_figcard)
    session.commit()
    session.close()
    return {"message": "Creadas las cartas de figura de la partida"}

def repartir_cartas_figura(id_partida: int):
    session = Session()
    try:
        # Obtengo la partida
        game = session.query(Game).filter(Game.id_partida == id_partida).first()
        # Obtengo los jugadores de la partida
        players = session.query(Player).filter(Player.id_partida == id_partida).all()
        # Obtengo las cartas de figura de la partida
        figcards = session.query(FigCard).filter(FigCard.id_partida == id_partida).all()
        # Las separo en faciles y dificiles
        hard_figcards = [figcard for figcard in figcards if figcard.type <= 18]
        easy_figcards = [figcard for figcard in figcards if figcard.type > 18]

        # Reparto ambas usando la misma lógica
        for deck in [hard_figcards, easy_figcards]:
            # Mezclo las cartas de figura
            shuffle(deck)
            # Calculo cuantas le tocan a cada uno
            number_of_figcards = len(deck) // game.cant_jugadores
            # Y las reparto entre los jugadores
            for player in players:
                # Elegir las cartas de cada jugador
                for _ in range(number_of_figcards):
                    new_figcard = deck.pop()
                    new_figcard.id_jugador = player.id_jugador
        session.commit()
    finally:
        session.close()

    return {"message": "Repartidas las cartas de figura"}



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
            
            # Asociar el jugador a la partida
            game.players.append(new_player)
            
            new_player.id_partida = game.id_partida

            # Marcar el jugador como 'in_game'
            new_player.in_game = True

            # Guardar los cambios
            session.commit()  # ¡IMPORTANTE! Guardar los cambios en la base de datos.

            # Notificar que un jugador se unió
            await manager.broadcast("player join")

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
                generar_tablero_aleatorio(nuevo_tablero.id_tablero)
                
                # Asignar las posiciones de los jugadores en la ronda
                asignar_posiciones(game_id)

                # Indicar que es el turno del primer jugador
                asignar_turno_primer_jugador(game_id)

                # Crear las cartas de movimiento de la partida
                crear_cartas_movimiento(game_id)
                
                # Repartir cartas de movimiento entre los jugadores
                repartir_cartas_movimiento(game_id)
                
                # Crear las cartas de figura de la partida
                crear_cartas_figura(game_id)

                # Repartir cartas de figura entre los jugadores
                repartir_cartas_figura(game_id)
                await manager_game.broadcast(game_id, "Game has started")
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
            player.id_partida = None
            player.in_game = False
            session.commit()
            await manager.broadcast("player leave")
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
            
            player.in_game = False
            player.id_partida = None
            
            for movcard in player.movcards:
                movcard.id_jugador = None
            for figcard in player.figcards:
                figcard.id_jugador = None
                figcard.shown = False
                
            session.commit()
            await manager_game.broadcast(player.id_partida, "Player has left the game") 
            return {"message": f"Player {player_id} has left the game"}
        finally:
            session.close()

