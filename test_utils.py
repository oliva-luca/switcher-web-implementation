import pytest
import asyncio
from  sqlalchemy.orm import sessionmaker
from utils import repartir_cartas_movimiento
from models import Game, engine, Base, Player, Tablero, MovCard, FigCard, Casilla 

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
