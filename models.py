from typing import Optional, List
from enum import Enum as PyEnum

from sqlalchemy import create_engine, Column, Integer, Boolean, String, ForeignKey 
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from config import DATABASE_FILENAME

# Define el nombre de la base de datos (ej: 'mi_base_de_datos.db')


# Configuración de la base de datos
engine = create_engine(f'sqlite:///{DATABASE_FILENAME}', echo=True)
Base = declarative_base()



# Definir la entidad Game
class Game(Base):
    __tablename__ = 'game'
    id_partida = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False )
    cant_jugadores = Column(Integer, nullable=False)
    started = Column(Boolean, nullable=False)
    is_private = Column(Boolean, nullable=False)
    password = Column(String,nullable=False)
    turn = Column(Integer, nullable=True)
    owner = Column(Integer, nullable=True)

    id_tablero = Column(Integer, ForeignKey('tablero.id_tablero'), nullable=True) 
    tablero = relationship("Tablero", backref="game")

    players = relationship("Player", back_populates="game")

    movcards = relationship("MovCard", back_populates="game")

    figcards = relationship("FigCard", back_populates="game")



class Player(Base):
    __tablename__ = 'player'
    
    id_jugador = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    in_game = Column(Boolean, nullable=False, default=False)
    block = Column(Boolean, nullable=False, default=False)  # Si está bloqueado
    position = Column(Integer, nullable=True)  # Posicion en la ronda

    # Relación con Game, asumiendo que cada jugador pertenece a una sola partida
    id_partida = Column(Integer, ForeignKey('game.id_partida'), nullable=True)
    
    # Definir una relación con la tabla Game (una partida puede tener varios jugadores)
    game = relationship("Game", back_populates="players")

    # Cartas de movimiento del jugador
    movcards = relationship("MovCard", back_populates="player")

    # Cartas de figura del jugador
    figcards = relationship("FigCard", back_populates="player")

# Definir los colores como un Enum
class Color(PyEnum):
    ROJO = "rojo"
    AZUL = "azul"
    VERDE = "verde"
    AMARILLO = "amarillo"

# Definir la clase Tablero
class Tablero(Base):
    __tablename__ = 'tablero'
    id_tablero = Column(Integer, primary_key=True, autoincrement=True)
    color_principal = Column(String, nullable=True)  # Mantienes el color principal si es necesario
    casillas = relationship("Casilla", back_populates="tablero")  # Relación con las casillas


# Tabla de Casillas
class Casilla(Base):
    __tablename__ = 'casilla'
    id_casilla = Column(Integer, primary_key=True, autoincrement=True)
    fila = Column(Integer, nullable=False)  # Número de fila (0 a 5)
    columna = Column(Integer, nullable=False)  # Número de columna (0 a 5)
    color = Column(String, nullable=False)  # Color de la casilla
    id_tablero = Column(Integer, ForeignKey('tablero.id_tablero'))  # Relación con el tablero
    tablero = relationship("Tablero", back_populates="casillas")

# Carta de movimiento
class MovCard(Base):
    __tablename__ = 'movcard'
    id_movcard = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(Integer, nullable=False)

    # Partida a la que pertenece
    id_partida = Column(Integer, ForeignKey('game.id_partida'), nullable=False)
    game = relationship("Game", back_populates="movcards")

    # Jugador al que pertence
    id_jugador = Column(Integer, ForeignKey('player.id_jugador'), nullable=True)
    player = relationship("Player", back_populates="movcards")

# Carta de figura
class FigCard(Base):
    __tablename__ = 'figcard'
    id_figcard = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(Integer, nullable=False)
    shown = Column(Boolean, nullable=False, default=False)

    # Partida a la que pertenece
    id_partida = Column(Integer, ForeignKey('game.id_partida'), nullable=False)
    game = relationship("Game", back_populates="figcards")

    # Jugador al que pertence
    id_jugador = Column(Integer, ForeignKey('player.id_jugador'), nullable=True)
    player = relationship("Player", back_populates="figcards")


# Crear las tablas en la base de datos
Base.metadata.create_all(engine)

# Crea una sesión
Session = sessionmaker(bind=engine)
session = Session()



