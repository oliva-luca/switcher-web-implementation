import pytest
from unittest.mock import MagicMock, patch
from board_to_test_board import *
from utils import *
from modifies_to_test import *
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