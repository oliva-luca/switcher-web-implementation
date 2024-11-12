from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import NoResultFound

from random import shuffle
from fastapi import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect

from figuras_dibujos import *
from models import Game, Player, User, Tablero, Casilla, MovCard, FigCard, engine
from typing import List, Dict, Tuple
import logging



def create_player(id_user: int, session):    
    user = session.query(User).filter(User.id_user==id_user).first()
    if user is None:
        return {'error': f"User with id {id_user} does not exist"}

    new_player_entry = Player(
        nombre=user.nombre,
        user_id=id_user
        )

    session.add(new_player_entry)
    session.commit()
    session.refresh(new_player_entry)
    return new_player_entry.id_jugador


#--------------------------- TABLERO -------------------------------------------------------------
class Modify:
    def __init__(self, id_cartamov: int, id_casilla1:int , id_casilla2:int):
        self.id_cartamov = id_cartamov
        self.id_casilla1 = id_casilla1
        self.id_casilla2 = id_casilla2

class Modifies:
    def __init__(self):
        self.modify: Dict[int, List[Modify]] = {}
    def add_modify(self, id_tablero : int, movcard_id : int, casilla1 : int, casilla2 :int):
        if id_tablero not in self.modify:
            self.modify[id_tablero] = []
        self.modify[id_tablero].append(Modify(movcard_id, casilla1, casilla2))

    def get_game_modifies(self, id_tablero: int):
        return self.modify.get(id_tablero, [])
    
    def clear_modifies(self, id_tablero: int):
        self.modify[id_tablero] = []

modificates =  Modifies()

def generar_tablero_aleatorio(id_tablero: int, session):
    # Los 4 colores que se van a distribuir equitativamente
    colores = ['rojo', 'azul', 'verde', 'amarillo']
    # Crear una lista con 9 repeticiones de cada color para llenar el tablero
    lista_colores = colores * 9
    shuffle(lista_colores)  # Barajar los colores aleatoriamente
    # Crear los casilleros y asignar colores
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
        return {"message": "Tablero generado con éxito"}

def asignar_posiciones(id_partida: int, session):
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
        return {"message": "Asignadas posiciones de los jugadores con éxito"}


def asignar_turno_primer_jugador(id_partida: int, session):
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
        return {"message": "Turno del primer jugador asignado con éxito"}


async def modificar_tablero(board: Dict):
    modifies = modificates.get_game_modifies(board["id_tablero"])
    print(len(modifies))
    print(len(modifies))
    print(len(modificates.modify.get(1, [])))
    for modify in modifies:
        casilla = next((c for c in board['casillas'] if c['id_casilla'] == modify.id_casilla1), None)
        casilla2 = next((c for c in board['casillas'] if c['id_casilla'] == modify.id_casilla2), None)
        if casilla is not None and casilla2 is not None:
            temp_color = casilla['color']
            casilla['color'] = casilla2['color']
            casilla2['color'] = temp_color
        else:
            raise HTTPException(status_code=404, detail="Casilla no encontrada")
    logging.debug(f"Modified board: {board}")
    return board
    

async def confirmar_cambios(session, game_id: int):
    old_board = session.query(Tablero).filter(Tablero.id_tablero == game_id).first()
    if old_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    new_board = await modificar_tablero(old_board.to_dict())
    for casilla in new_board['casillas']:
        cas = session.query(Casilla).filter(Casilla.id_casilla == casilla['id_casilla']).first()
        cas.color = casilla['color']
            
    for Modificate in modificates.get_game_modifies(game_id):
        mov_card = session.query(MovCard).filter(MovCard.id_movcard == Modificate.id_cartamov).first()
        mov_card.state = False
        mov_card.id_jugador = None
    modificates.clear_modifies(game_id)


#--------------------------- CARTAS DE MOVIMIENTO -------------------------------------------------------------

def crear_cartas_movimiento(id_partida: int, session):
    # Cantidad de cartas de movimiento diferentes
    number_of_types = 7
    # Cantidad de repeticiones de cada carta
    repetitions = 7
    # Crear las 49 cartas y agregarlas
    for _ in range(repetitions):
        for type in range(1, number_of_types+1):
            new_movcard = MovCard(
                type = type,
                id_partida = id_partida
            )
            session.add(new_movcard)
    session.commit()
    return {"message": "Creadas las cartas de movimiento de la partida"}

# Obtiene las cartas de movimiento que no le pertencen a ningun jugador
# en la partida dada por id_partida
def obtener_movcars_libres(id_partida: int, session):
    free_movcards = session.query(MovCard).filter((MovCard.id_partida == id_partida) & 
                                                  (MovCard.id_jugador == None)).all()
    return free_movcards

# Cuentas las cartas de movimiento de un jugador
def contar_movcards(id_jugador: int, session):
    count = session.query(MovCard).filter(MovCard.id_jugador == id_jugador).count()
    return count

def repartir_cartas_movimiento(id_partida: int, id_jugador: int, session):
    try:
        # Obtengo las cartas de movimienta de la partida sin usar
        free_movcards = obtener_movcars_libres(id_partida, session)
        # Mezclo las cartas de movimiento
        shuffle(free_movcards)
        # Cuento la cantidad de cartas de movimiento que tiene
        player_movcards = contar_movcards(id_jugador, session)
        # Y le doy al jugador hasta que tenga 3
        while(player_movcards < 3):
            new_movcard = free_movcards.pop()
            new_movcard.id_jugador = id_jugador
            player_movcards += 1
        session.commit()

    finally:
        return {"message": "Repartidas las cartas de movimiento"}



#--------------------------- CARTAS DE FIGURA  -------------------------------------------------------------

def crear_cartas_figura(id_partida: int, session):
    # Cantidad de cartas de figura diferentes
    number_of_types = 25
    # Cantidad de repeticiones de cada carta
    repetitions = 2
    # Crear las 50 cartas y agregarlas
    for _ in range(repetitions):
        for type in range(1, number_of_types+1):
            new_figcard = FigCard(
                type = type,
                id_partida = id_partida
            )
            session.add(new_figcard)
    session.commit()
    return {"message": "Creadas las cartas de figura de la partida"}

def repartir_cartas_figura(id_partida: int, session):
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
        return {"message": "Repartidas las cartas de figura"}

def repartir_una_carta_figura(id_partida: int, session):
    try:
        # Obtengo la partida
        game = session.query(Game).filter(Game.id_partida == id_partida).first()
        # Obtengo los jugadores de la partida
        players = session.query(Player).filter(Player.id_partida == id_partida).all()
        # Obtengo las cartas de figura de la partida
        figcards = session.query(FigCard).filter(FigCard.id_partida == id_partida).all()

        # Reparto la carta
        for player in players:
            new_figcard = figcards.pop()
            new_figcard.id_jugador = player.id_jugador
        session.commit()
    finally:
        return {"message": "Repartidas las cartas de figura"}

def mostrar_cartas_figura(id_jugador : int, session):
    # Obtengo el jugador
    player = session.query(Player).filter(Player.id_jugador == id_jugador).first()
    # Solo repartirle si no está bloqueado
    if not player.blocked:
        # Obtengo las cartas de figura del jugador
        player_figcards = list(session.query(FigCard).filter(FigCard.id_jugador == id_jugador).all())
        # Obtengo solo las cartas sin mostrar
        not_shown_figcards = [card for card in player_figcards if not card.shown]
        # Las mezclo
        shuffle(not_shown_figcards)
        # Obtengo cuántas si se muestran
        number_shown_figcards = len([card for card in player_figcards if card.shown])
        while(len(not_shown_figcards) > 0 and number_shown_figcards < 3):
            new_figcard = not_shown_figcards.pop()
            new_figcard.shown = True
            number_shown_figcards += 1
        session.commit()


#--------------------------- COMPUTAR COMPONENTES  -------------------------------------------------------------
# Chequea si el par (fila, columna) es una casilla válida
# Las coordenadas de las casillas deben estar entre 0 y 6 no inclusive
def es_valida(fila: int, columna: int):
    return 0 <= fila < 6 and 0 <= columna < 6

# Direcciones a moverse para llegar a una casilla vecina
directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

# Calcula la casilla obtenida al moverse en cierta direccion
def mover_en_direccion(casilla: tuple, direccion: tuple):
    return (casilla[0] + direccion[0], casilla[1] + direccion[1])

# Dada la casilla (fila, columna) calcula sus casillas vecinas
def obtener_vecinas(fila: int, columna: int):
    vecinos = []
    for dir in directions:
        nueva_casilla = mover_en_direccion((fila, columna), dir)
        if(es_valida(*nueva_casilla)):
            vecinos.append(nueva_casilla)
    return vecinos

# Devuelve la lista de casillas que pertenecen a la componente de una casilla dada
# Precondicion: La casilla inicial no fue visitada anteriormente
# El algoritmo es un BFS (Búsqueda en profundidad)
def obtener_componente_de_casilla(tablero: List, visited: List, casilla: tuple):
    componente = [casilla]
    visited[casilla[0]][casilla[1]] = True
    color = tablero[casilla[0]][casilla[1]] # color de las casillas de la componente
    for nueva_casilla in componente:
        vecinos = obtener_vecinas(*nueva_casilla)
        for vecino in vecinos:
            if(not visited[vecino[0]][vecino[1]] and tablero[vecino[0]][vecino[1]] == color):
                componente.append(vecino)
                visited[vecino[0]][vecino[1]] = True
    return componente

# Toma como entrada una lista de 6 listas, cada uno de ellas 
# contiene 6 strings, que son los colores de las casillas
# La primera lista representa la primera fila del tablero y así sucesivamente
# La salida es una lista de listas, cada lista contiene pares (fila, columna)
# que representan las casillas de esa componente.
def obtener_componentes_conexas(tablero : List):
    componentes = []
    visited = [[False] * 6 for i in range(6)]
    for fila in range(6):
        for columna in range(6):
            if(not visited[fila][columna]):
                nueva_comp = obtener_componente_de_casilla(tablero, visited, (fila, columna))
                componentes.append(nueva_comp)
    return componentes

# Dado un tablero de la clase Tablero, se queda solo con los colores de las casillas
# Y devuelve una matriz de 6 x 6 con los colores (lista de listas)
def simplificar_tablero(tablero: Tablero):
    colores = [[None] * 6 for i in range(6)]
    casillas = tablero.casillas
    for casilla in casillas:
        colores[casilla.fila][casilla.columna] = casilla.color
    return colores


#--------------------------- DETECTAR FIGURAS  -------------------------------------------------------------
# Toma un dibujo (como los de figuras_dibujos) y lo rota 90 grados
# en sentido antihorario
# La rotacion es (x, y) -> (-y, x)
def rotar_dibujo(dibujo: List):
    alto = len(dibujo)      # del dibujo original
    ancho = len(dibujo[0])  # del dibujo original
    nuevo_dibujo = []
    for columna in range(ancho):
        nuevo_dibujo.append("")
        for fila in range(alto):
            nuevo_dibujo[-1] += (dibujo[fila][-columna-1])
    return nuevo_dibujo

# Dado un dibujo, obtiene las coordenas de las casillas
# La casilla (0, 0) será la más alta, si empatan
# la de más a la izquierda
def obtener_coordenadas_de_dibujo(dibujo: List):
    coordenadas = []
    alto = len(dibujo)
    ancho = len(dibujo[0])
    origen = None
    for fila in range(alto):
        for columna in range(ancho):
            if(dibujo[fila][columna] == 'O'):   # es una parte de la figura
                if origen is None:
                    origen = (fila, columna)
                coordenadas.append((fila - origen[0], columna - origen[1]))
    return coordenadas

# Mueve todas las casillas de 'casillas' en
# la dirección 'direccion'
def mover_casillas(casillas: List, direccion: Tuple):
    nuevas_casillas = []
    for casilla in casillas:
        nuevas_casillas.append(mover_en_direccion(casilla, direccion))
    return nuevas_casillas

# Dada una componente de casillas (cada una de la forma (fila, columna))
# detecta si ellas forman la figura de tipo 'figure_type'
# Los 25 tipos de figuras se muestran en 'figuras_dibujos.py'
def detectar_figura(componente: List, figure_type: int):
    if not 1 <= figure_type <= 25:
        return False    # cambiar por excepcion???
    componente.sort()
    dibujo = dibujos[figure_type]
    coincidencia = False
    for _ in range(4):              # para las 4 rotaciones
        coords = obtener_coordenadas_de_dibujo(dibujo)
        figura_correcta = mover_casillas(coords, componente[0])
        if figura_correcta == componente:
            coincidencia = True     # esta rotación coincide con la figura
        dibujo = rotar_dibujo(dibujo)
    return coincidencia

# Dadas muchas componentes de casillas (cada una como lista de pares (fila, columna))
# y multiples tipos de figura, devuelve solo aquellas componentes que formen 
# una figura en figure_types como pares (tipo, componente)
def detectar_multiples_figuras(componentes: List, figure_types: List):
    resultado = []
    for comp in componentes:
        for type in figure_types:
            if detectar_figura(comp, type):
                resultado.append((type, comp))
    return resultado

# Obtiene los tipos de figura que hay que buscar en el tablero en una partida
def obtener_figuras_de_jugadores(id_partida: int, session):
    # Obtengo las cartas de figura mostradas de la partida
    figcards = session.query(FigCard).filter((FigCard.id_partida == id_partida) &
                                             (FigCard.shown) & (FigCard.player is not None) &
                                             (False == FigCard.blocked)).all()
    # Me quedo solo con sus tipos
    figcards_types = [figcard.type for figcard in figcards]
    return figcards_types

# Elimina las figuras detectadas que son del color prohibido
# 'figuras_detectadas' debe respetar el formato del output de detectar_multiples_figuras
# 'colores_de_tablero' tiene que tener el mismo formato que el input de 'obtener_componentes_conexas'
# color_prohibido es un string que indica el color prohibido o None si no existe
def filtrar_color_prohibido(figuras_detectadas: List, colores_de_tablero: List, color_prohibido: str):
    figuras_filtradas = []
    for type, comp in figuras_detectadas:
        # Obtengo cualquier casilla de la componente
        casilla = (comp[0][0], comp[0][1])
        # Obtengo su color
        color = colores_de_tablero[casilla[0]][casilla[1]]
        # Veo que no sea el color prohibido
        if(color != color_prohibido):
            figuras_filtradas.append((type, comp))
    return figuras_filtradas

# Toma el id de la partida, la lista de colores del tablero, el color prohibido y una session
# 'colores_de_tablero' tiene que tener el mismo formato que el input de 'obtener_componentes_conexas'
# Devuelve una lista de pares de la forma (tipo, componente)
# que representan todas las figuras que se encuentran en el tablero
# y como carta de figura (visible) de algún jugador
# tipo es el tipo de la carta de figura (entre 1 y 25)
# componente son las coordenadas de las casillas que la conforman 
def obtener_figuras_tablero(id_partida: int, colores_de_tablero: List, color_prohibido: str, session):
    try:
        # Calculo las componentes
        componentes = obtener_componentes_conexas(colores_de_tablero)
        # Obtengo los tipos de figura relevantes
        figuras_types = obtener_figuras_de_jugadores(id_partida, session)
        # Calcula la lista resultado
        resultado_parcial = detectar_multiples_figuras(componentes, figuras_types)
        # Sacar las del color prohibido
        resultado = filtrar_color_prohibido(resultado_parcial, colores_de_tablero, color_prohibido)
    finally:
        pass
    return resultado


#--------------------------- INFROMACION DE CASILLA  -------------------------------------------------------
# Para cada casilla de un tablero, la actualiza indicando la componente a la que pertence
def actualizar_informacion_casillas(id_partida: int, tablero : Tablero, session, modificaciones = None):
    session.refresh(tablero)

    colores = simplificar_tablero(tablero)

    # Hacer las modificacion si hay
    if modificaciones != None:
        for modif in modificaciones:
            casilla1 = session.query(Casilla).filter(Casilla.id_casilla == modif.id_casilla1).one()
            casilla2 = session.query(Casilla).filter(Casilla.id_casilla == modif.id_casilla2).one()
            
            ubi_1 = (casilla1.fila, casilla1.columna)   # ubicacion casilla 1
            ubi_2 = (casilla2.fila, casilla2.columna)   # ubicacion casilla 2
            colores[ubi_1[0]][ubi_1[1]], colores[ubi_2[0]][ubi_2[1]] = colores[ubi_2[0]][ubi_2[1]], colores[ubi_1[0]][ubi_1[1]]


    figuras = obtener_figuras_tablero(id_partida, colores, tablero.color_prohibido, session)

    for casilla in tablero.casillas:
        casilla.figura = -1

    for tipo_figura, componente in figuras:
        for fila, columna in componente:
            casilla = session.query(Casilla).filter((Casilla.id_tablero == tablero.id_tablero) & 
                                                    (Casilla.fila == fila) & 
                                                    (Casilla.columna == columna)).one()
            casilla.figura = tipo_figura

    session.commit()