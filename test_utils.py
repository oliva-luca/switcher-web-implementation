import pytest
from unittest.mock import MagicMock, patch
import asyncio
from  sqlalchemy.orm import sessionmaker
from utils import *
from board_to_test_board import *
from models import Game, engine, Base, Player, Tablero, MovCard, FigCard, Casilla 
from modifies_to_test import *


Session = sessionmaker(bind=engine)

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_refill_movcards_having_3():
    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(movcards) == 3
    finally:
        session.close()

    session = Session()
    try:
        repartir_cartas_movimiento(6, 7, session)
    finally:
        session.close()
    
    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(movcards) == 3
    finally:
        session.close()
    
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_refill_movcards_having_2():
    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(movcards) == 3
    finally:
        session.close()

    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        movcards[0].id_jugador = None
        session.commit()
        new_movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(new_movcards) == 2
    finally:
        session.close()

    session = Session()
    try:
        repartir_cartas_movimiento(6, 7, session)
    finally:
        session.close()
    
    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(movcards) == 3
    finally:
        session.close()

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_refill_movcards_having_1():
    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(movcards) == 3
    finally:
        session.close()

    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        movcards[0].id_jugador = None
        movcards[1].id_jugador = None
        session.commit()
        new_movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(new_movcards) == 1
    finally:
        session.close()

    session = Session()
    try:
        repartir_cartas_movimiento(6, 7, session)
    finally:
        session.close()
    
    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(movcards) == 3
    finally:
        session.close()

    
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_refill_movcards_having_0():
    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(movcards) == 3
    finally:
        session.close()

    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        for movcard in movcards:
            movcard.id_jugador = None
        session.commit()
        new_movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(new_movcards) == 0
    finally:
        session.close()

    session = Session()
    try:
        repartir_cartas_movimiento(6, 7, session)
    finally:
        session.close()
    
    session = Session()
    try:
        movcards = session.query(MovCard).filter(MovCard.id_jugador == 7).all()
        assert len(movcards) == 3
    finally:
        session.close()


#-------------------TEST MODIFIES-------------------
def test_add_modifies(modify_1, modify_2, modify_4):
    test_modificates = Modifies()
    test_modificates.add_modify(1,1,1,2)
    test_modificates.add_modify(1,1,2,1)
    test_modificates.add_modify(1,1,3,9)
    
    expected_modifies = [modify_1, modify_2, modify_4]
    actual_modifies = test_modificates.modify.get(1, [])
    assert len(expected_modifies) == len(actual_modifies) 
    for i in range(len(expected_modifies)):
        assert expected_modifies[i].id_cartamov == actual_modifies[i].id_cartamov
        assert expected_modifies[i].id_casilla1 == actual_modifies[i].id_casilla1
        assert expected_modifies[i].id_casilla2 == actual_modifies[i].id_casilla2   
    
def test_get_modifies(modify_1, modify_2, modify_4):
    test_modificates = Modifies()
    test_modificates.modify[1] = [modify_1, modify_2, modify_4]
    expected_modifies = [modify_1, modify_2, modify_4]
    actual_modifies = test_modificates.get_game_modifies(1)
    assert len(expected_modifies) == len(actual_modifies) 
    for i in range(len(expected_modifies)):
        assert expected_modifies[i].id_cartamov == actual_modifies[i].id_cartamov
        assert expected_modifies[i].id_casilla1 == actual_modifies[i].id_casilla1
        assert expected_modifies[i].id_casilla2 == actual_modifies[i].id_casilla2

def test_get_modifies_empty():
    test_modificates = Modifies()
    expected_modifies = []
    actual_modifies = test_modificates.get_game_modifies(1)
    assert expected_modifies == actual_modifies
    
def test_get_modifies_no_game2(modify_1, modify_2, modify_4):
    test_modificates = Modifies()
    test_modificates.modify[1] = [modify_1, modify_2, modify_4]
    expected_modifies = []
    actual_modifies = test_modificates.get_game_modifies(2)
    assert expected_modifies == actual_modifies
    
def test_clear_modifies(modify_1, modify_2, modify_4):
    test_modificates = Modifies()
    test_modificates.modify[1] = [modify_1, modify_2, modify_4]
    test_modificates.clear_modifies(1)
    expected_modifies = []
    actual_modifies =  test_modificates.modify.get(1, [])
    assert expected_modifies == actual_modifies

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
    
@pytest.mark.asyncio
async def test_modificar_tablero(tablero_a, modify_1, modify_3):
    modificates = {1: [modify_1, modify_3]}
    for casillas in tablero_a['casillas']:
        if casillas['id_casilla'] == 1 :
            color_1= casillas['color'] #verde
        if casillas['id_casilla'] == 2 :
            color_2= casillas['color'] #amarillo
        if casillas['id_casilla'] == 3 :
            color_3= casillas['color'] #rojo
    
    with patch('utils.modificates.modify', modificates):
        modified_board = await modificar_tablero(tablero_a)
        
    for casillas in modified_board['casillas']:
        if casillas['id_casilla'] == 1 :
            assert casillas['color'] == color_2
        if casillas['id_casilla'] == 2 :
            assert casillas['color'] == color_3
        if casillas['id_casilla'] == 3 :
            assert casillas['color'] == color_1
            
@pytest.mark.asyncio
async def test_modificar_tablero_no_modifies(tablero_a):
    modificates = {1: []}
    with patch('utils.modificates.modify', modificates):
        modified_board = await modificar_tablero(tablero_a)
    assert modified_board == tablero_a
    
@pytest.mark.asyncio
async def test_modificar_tablero_casilla_no_encontrada(tablero_a, modify_7):
    modificates = {1: [modify_7]}
    with patch('utils.modificates.modify', modificates):
        with pytest.raises(HTTPException) as excinfo:
                await modificar_tablero(tablero_a)
                assert excinfo.value.status_code == 404
                assert excinfo.value.detail == "Casilla no encontrada"
                
@pytest.mark.asyncio
async def test_modificar_tablero_mismas_casillas(tablero_a, modify_1):
    modificates = {1: [modify_1, modify_1]}
    with patch('utils.modificates.modify', modificates):
        modified_board = await modificar_tablero(tablero_a)
    assert modified_board == tablero_a
    
@pytest.mark.asyncio
async def test_modificar_tablero_movimientos_equivalentes(tablero_a, modify_1, modify_2):
    modificates = {1: [modify_1, modify_2]}
    with patch('utils.modificates.modify', modificates):
        modified_board = await modificar_tablero(tablero_a)
    assert modified_board == tablero_a
    
@pytest.mark.asyncio
async def test_modificar_tablero_movimientos_equivalentes2(tablero_a, modify_1, modify_2):
    modificates = {1: [modify_1, modify_2]}
    with patch('utils.modificates.modify', modificates):
        modified_board = await modificar_tablero(tablero_a)
    with patch('utils.modificates.modify', modificates):
        modified_board2 = await modificar_tablero(tablero_a)
    assert modified_board == modified_board2
    
@pytest.mark.asyncio
async def test_modificar_tablero_valid_board(tablero_a,modify_3,modify_6,modify_8):
    modificates = {1: [modify_3,modify_6,modify_8]}
    with patch('utils.modificates.modify', modificates):
        modified_board = await modificar_tablero(tablero_a)
    assert validar_tablero(modified_board)

@pytest.mark.asyncio
async def test_modificar_tablero_colores_iguales(tablero_a,modify_9):
    modificates = {1: [modify_9]}
    with patch('utils.modificates.modify', modificates):
        modified_board = await modificar_tablero(tablero_a)
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


#-------------------TESTS DE COMPONENTES-------------------
@pytest.fixture
def colores_de_tablero():
    return [
        ["B", "B", "B", "D", "D", "D"],
        ["C", "A", "B", "C", "C", "D"],
        ["D", "A", "A", "D", "D", "C"],
        ["C", "A", "A", "C", "A", "C"],
        ["D", "B", "A", "A", "A", "C"],
        ["B", "B", "B", "B", "D", "C"]
    ]

# Ver que cada casilla esté en exactamente una componente
def test_each_tile_in_exactly_one_component(colores_de_tablero):
    componentes = obtener_componentes_conexas(colores_de_tablero)
    for fila in range(6):
        for columna in range(6):
            number_of_comp = 0
            for comp in componentes:
                if (fila,columna) in comp:
                    number_of_comp += 1
            assert number_of_comp == 1

# Ver que todas las componentes sean no vacías
def test_all_components_nonempty(colores_de_tablero):
    componentes = obtener_componentes_conexas(colores_de_tablero)
    for comp in componentes:
        assert len(comp) != 0

# Ver que todas las casillas de una componente sean del mismo color
def test_all_tiles_in_component_have_same_color(colores_de_tablero):
    componentes = obtener_componentes_conexas(colores_de_tablero)
    for comp in componentes:
        color = colores_de_tablero[comp[0][0]][comp[0][1]]
        for casilla in comp:
            assert colores_de_tablero[casilla[0]][casilla[1]] == color


# Ver que si dos casillas comparten un lado y son del mismo color,
# entonces están en la misma componente.
def test_adyacent_equal_tiles_in_same_component(colores_de_tablero):
    componentes = obtener_componentes_conexas(colores_de_tablero)
    comp_of_tile = [[0] * 6 for i in range(6)]
    id_componente = 0
    for comp in componentes:
        id_componente += 1
        for casilla in comp:
            comp_of_tile[casilla[0]][casilla[1]] = id_componente
    # Chequeos horizontales
    for fila in range(6):
        for columna in range(5):
            color_a = colores_de_tablero[fila][columna]
            comp_a = comp_of_tile[fila][columna]
            color_b = colores_de_tablero[fila][columna + 1]
            comp_b = comp_of_tile[fila][columna + 1]
            assert color_a != color_b or comp_a == comp_b
    # Chequeos verticales
    for fila in range(5):
        for columna in range(6):
            color_a = colores_de_tablero[fila][columna]
            comp_a = comp_of_tile[fila][columna]
            color_b = colores_de_tablero[fila + 1][columna]
            comp_b = comp_of_tile[fila + 1][columna]
            assert color_a != color_b or comp_a == comp_b

#-------------------TESTS DE DETECTAR FIGURAS ----------------------
@pytest.fixture
def dibujo_a():
    return [
        "OOOO",
        "...O"
    ]

@pytest.fixture
def dibujo_a_rot():
    return [
        "OO",
        "O.",
        "O.",
        "O."
    ]

@pytest.fixture
def dibujo_a_coords_shifted():
    return [
        (3, 2),
        (3, 3),
        (3, 4),
        (3, 5),
        (4, 5)
    ]

@pytest.fixture
def dibujo_a_rot_coords_shifted():
    return [
        (1, 2),
        (1, 3),
        (2, 2),
        (3, 2),
        (4, 2)
    ]

@pytest.fixture
def dibujo_a_rot_rot_coords_shifted():
    return [
        (0, 1),
        (1, 1),
        (1, 2),
        (1, 3),
        (1, 4)
    ]

@pytest.fixture
def dibujo_a_flipped():
    return [
        (0, 0),
        (0, 1),
        (0, 2),
        (0, 3),
        (1, 0),
    ]

@pytest.fixture
def dibujo_b():
    return [
        "..O.",
        "OOOO",
        "..O."
    ]

@pytest.fixture
def dibujo_b_coords():
    return [
        (0, 0),
        (1, -2),
        (1, -1),
        (1, 0),
        (1, 1),
        (2, 0)
    ]

@pytest.fixture
def dibujo_b_coords_shifted():
    return [
        (2, 1),
        (3, -1),
        (3, 0),
        (3, 1),
        (3, 2),
        (4, 1)
    ]

# Ver que la rotación funcione como se espera
def test_rotation(dibujo_a, dibujo_a_rot):
    dibujo_a = rotar_dibujo(dibujo_a)
    assert dibujo_a == dibujo_a_rot

# Ver que al rotar 4 veces obtenemos la figura original
def test_rotate_4_times_eq_original(dibujo_a):
    dibujo_a_copy = dibujo_a.copy()
    for _ in range(4):
        dibujo_a_copy = rotar_dibujo(dibujo_a_copy)
    assert dibujo_a_copy == dibujo_a

# Ver que la funcion 'obtener_coordenadas_de_dibujo' funcione correctamente
def test_get_coordinates(dibujo_b, dibujo_b_coords):
    coordenadas = obtener_coordenadas_de_dibujo(dibujo_b)
    coordenadas.sort()
    assert coordenadas == dibujo_b_coords

# Ver que la funcion 'mover_casillas' funcione correctamente
def test_move_tiles(dibujo_b_coords, dibujo_b_coords_shifted):
    nuevas_coords = mover_casillas(dibujo_b_coords, (2, 1))
    assert nuevas_coords == dibujo_b_coords_shifted

# # Ver que la funcion 'detectar_figura' funcione correctamente
def test_detect_figures(dibujo_a_coords_shifted):
    assert detectar_figura(dibujo_a_coords_shifted, 7)

# Ver que la funcion 'detectar_figura' funcione correctamente
# cuando la figura está rotada
def test_detect_figures_rotated(dibujo_a_rot_coords_shifted):
    assert detectar_figura(dibujo_a_rot_coords_shifted, 7)

# Ver que la funcion 'detectar_figura' funcione correctamente
# cuando la figura está rotada dos veces
def test_detect_figures_twice_rotated(dibujo_a_rot_rot_coords_shifted):
    assert detectar_figura(dibujo_a_rot_rot_coords_shifted, 7)

# Ver que la funcion 'detectar_figura' funcione correctamente
# cuando la figura está espejada y no es una rotación
def test_detect_figures_flipped(dibujo_a_flipped):
    assert not detectar_figura(dibujo_a_flipped, 7)

@pytest.fixture
def colores_de_tablero_b():
    return [
        ["V", "M", "R", "Z", "M", "M"],
        ["M", "M", "M", "Z", "R", "V"],
        ["Z", "R", "V", "Z", "R", "R"],
        ["Z", "V", "V", "V", "R", "R"],
        ["Z", "V", "M", "Z", "M", "V"],
        ["Z", "R", "R", "V", "M", "Z"],
    ]

@pytest.mark.integration_test
def test_detected_figures_are_shown(colores_de_tablero_b):
    session = Session()
    try:
        figure_types = obtener_figuras_de_jugadores(6, session)
        matching_figures = obtener_figuras_tablero(6, colores_de_tablero_b, None, session)
        for type, _ in matching_figures:
            assert type in figure_types
    finally:
        session.close()

@pytest.mark.integration_test
def test_not_detect_forbidden_color(colores_de_tablero_b):
    session = Session()
    try:
        colors = ["V", "M", "R", "Z"] # colores del tablero de este test
        for color_prohibido in colors:
            matching_figures = obtener_figuras_tablero(6, colores_de_tablero_b, color_prohibido, session)
            for _, comp in matching_figures:
                casilla = (comp[0][0], comp[0][1])
                color_casilla = colores_de_tablero_b[casilla[0]][casilla[1]]
                assert color_casilla != color_prohibido
    finally:
        session.close()
