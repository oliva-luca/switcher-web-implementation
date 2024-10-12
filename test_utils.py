import pytest
from unittest.mock import MagicMock, patch
from board_to_test_board import *
from utils import *
from modifies_to_test import *
from models import Game, engine, Base, Player, Tablero, MovCard, FigCard, Casilla

Session = sessionmaker(bind=engine)

#-------------------TEST TABLERO-------------------
def validar_tablero(Dict : dict):
    verde = 0
    amarillo = 0
    rojo = 0
    azul = 0
    posiciones: List[tuple[int, int]] = []
    for casilla in Dict['casillas']:
        if casilla['color'] == 'verde':
            verde += 1
        if casilla['color'] == 'amarillo':
            amarillo += 1
        if casilla['color'] == 'rojo':
            rojo += 1
        if casilla['color'] == 'azul':
            azul += 1
        if [casilla['fila'], casilla['columna']] in posiciones:
            return False
        posiciones.append([casilla['fila'], casilla['columna']])
    return (verde == 9 and amarillo == 9 and rojo == 9 and azul == 9)
    

def test_modificar_tablero(tablero_a, modify_1, modify_3):
    to_modify = {1: [modify_1, modify_3]}
    for casillas in tablero_a['casillas']:
        if casillas['id_casilla'] == 1 :
            color_1= casillas['color']
        if casillas['id_casilla'] == 2 :
            color_2= casillas['color']
        if casillas['id_casilla'] == 3 :
            color_3= casillas['color']
    
    with patch('utils.to_modify', to_modify):
        modified_board = modificar_tablero(tablero_a)
        
    for casillas in modified_board['casillas']:
        if casillas['id_casilla'] == 1 :
            assert casillas['color'] == color_2
        if casillas['id_casilla'] == 2 :
            assert casillas['color'] == color_3
        if casillas['id_casilla'] == 3 :
            assert casillas['color'] == color_1
            
def test_modificar_tablero_no_modifies(tablero_a):
    to_modify = {1: []}
    with patch('utils.to_modify', to_modify):
        modified_board = modificar_tablero(tablero_a)
    assert modified_board == tablero_a
    
def test_modificar_tablero_casilla_no_encontrada(tablero_a, modify_7):
    to_modify = {1: [modify_7]}
    with patch('utils.to_modify', to_modify):
        with pytest.raises(HTTPException) as excinfo:
                modificar_tablero(tablero_a)
                assert excinfo.value.status_code == 404
                assert excinfo.value.detail == "Casilla no encontrada"
                
def test_modificar_tablero_mismas_casillas(tablero_a, modify_1):
    to_modify = {1: [modify_1, modify_1]}
    with patch('utils.to_modify', to_modify):
        modified_board = modificar_tablero(tablero_a)
    assert modified_board == tablero_a
    
def test_modificar_tablero_movimientos_equivalentes(tablero_a, modify_1, modify_2):
    to_modify = {1: [modify_1, modify_2]}
    with patch('utils.to_modify', to_modify):
        modified_board = modificar_tablero(tablero_a)
    assert modified_board == tablero_a
    
def test_modificar_tablero_movimientos_equivalentes2(tablero_a, modify_1, modify_2):
    to_modify = {1: [modify_1, modify_2]}
    with patch('utils.to_modify', to_modify):
        modified_board = modificar_tablero(tablero_a)
    with patch('utils.to_modify', to_modify):
        modified_board2 = modificar_tablero(tablero_a)
    assert modified_board == modified_board2
    
def test_modificar_tablero_valid_board(tablero_a,modify_3,modify_6,modify_8):
    to_modify = {1: [modify_3,modify_6,modify_8]}
    with patch('utils.to_modify', to_modify):
        modified_board = modificar_tablero(tablero_a)
    assert validar_tablero(modified_board)

def test_modificar_tablero_colores_iguales(tablero_a,modify_9):
    to_modify = {1: [modify_9]}
    with patch('utils.to_modify', to_modify):
        modified_board = modificar_tablero(tablero_a)
    assert modified_board == tablero_a


@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_show_figcards_having_2_shown():
    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(figcards) == 3
    finally:
        session.close()
    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        figcards[0].id_jugador = None
        session.commit()
        new_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(new_figcards) == 2
    finally:
        session.close()
    session = Session()
    try:
        mostrar_cartas_figura(7, session)
    finally:
        session.close()
    
    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(figcards) == 3
    finally:
        session.close()

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_show_figcards_having_0_shown():
    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(figcards) == 3
    finally:
        session.close()
    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        for figcard in figcards:
            figcard.id_jugador = None
        session.commit()
        new_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(new_figcards) == 0
    finally:
        session.close()
    session = Session()
    try:
        mostrar_cartas_figura(7, session)
    finally:
        session.close()
    
    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(figcards) == 3
    finally:
        session.close()

# Revisa que las nuevas cartas mostradas eran del mismo jugador 
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_shown_figcards_are_own():
    session = Session()
    try:
        shown_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(shown_figcards) == 3
        all_figcards = session.query(FigCard).filter(FigCard.id_jugador == 7).all()
        figcards_id = [figcard.id_figcard for figcard in all_figcards]  # Para chequear que esten aca
        assert len(all_figcards) >= 6
    finally:
        session.close()
    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        for figcard in figcards:
            figcard.id_jugador = None
        session.commit()
        new_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(new_figcards) == 0
    finally:
        session.close()
    session = Session()
    try:
        mostrar_cartas_figura(7, session)
    finally:
        session.close()
    
    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        for figcard in figcards:
            assert(figcard.id_figcard in figcards_id)
    finally:
        session.close()

# Solo le queda 1 carta mostrandose y solo 1 sin mostrar
# Al llamar a la funcion, tienen que estar las dos (todas) mostrandose
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_show_figcards_having_just_1_shown_1_not_shown():
    # Precondicion
    session = Session()
    try:
        figcards = session.query(FigCard).filter(FigCard.id_jugador == 7).all()
        assert len(figcards) >= 5
    finally:
        session.close()
    # Preparo la situacion
    session = Session()
    try:
        shown_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        shown_figcards.pop()
        for figcard in shown_figcards:
            figcard.id_jugador = None
        not_shown_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (~FigCard.shown)).all()
        not_shown_figcards.pop()
        for figcard in not_shown_figcards:
            figcard.id_jugador = None
        session.commit()
        new_shown_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        assert len(new_shown_figcards) == 1
        new_not_shown_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (~FigCard.shown)).all()
        assert len(new_not_shown_figcards) == 1
    finally:
        session.close()
    session = Session()
    try:
        mostrar_cartas_figura(7, session)
    finally:
        session.close()
    
    session = Session()
    try:
        shown_figcards = session.query(FigCard).filter((FigCard.id_jugador == 7) & (FigCard.shown)).all()
        all_figcards = session.query(FigCard).filter(FigCard.id_jugador == 7).all()
        assert len(shown_figcards) == len(all_figcards)
    finally:
        session.close()
