from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import NoResultFound

from random import shuffle
from fastapi import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect

from models import Game, Player, Tablero, Casilla, MovCard, FigCard, engine
from typing import List,Dict


#--------------------------- TABLERO -------------------------------------------------------------


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



def repartir_cartas_movimiento(id_partida: int, id_jugador: int, session):
    try:
        # Obtengo las cartas de movimienta de la partida sin usar
        free_movcards = session.query(MovCard).filter((MovCard.id_partida == id_partida) & 
                                                      (MovCard.id_jugador == None)).all()
        # Mezclo las cartas de movimiento
        shuffle(free_movcards)
        print(f"Hay en total {len(free_movcards)} movcards disponibles!!!!!!!")
        print(f"Partida {id_partida}, jugador {id_jugador}")
        # Cuento la cantidad de cartas de movimiento que tiene
        player_movcards = session.query(MovCard).filter(MovCard.id_jugador == id_jugador).count()
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

def mostrar_cartas_figura_incial(id_partida: int, session):
    try:
        # Obtengo los jugadores de la partida
        players = session.query(Player).filter(Player.id_partida == id_partida).all()

        # Hago tres cartas de figura de cada jugador visibles
        for player in players:
            player_figcards = list(session.query(FigCard).filter(FigCard.id_jugador == player.id_jugador).all())
            shuffle(player_figcards)
            for _ in range(3):
                new_figcard = player_figcards.pop()
                new_figcard.shown = True

        session.commit()
    finally:
        pass
