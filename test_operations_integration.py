import pytest
import asyncio
from  sqlalchemy.orm import sessionmaker
from operations import Operations, GameNotFoundError, PlayerNotFoundError
from models import Game, engine, Base, Player

Session = sessionmaker(bind=engine)



@pytest.fixture
def operation():
    return Operations()

@pytest.mark.integration_test
def test_get_games(operation: Operations):
    session = Session()
    try:
        games = operation.get_games()
        N_games = session.query(Game).count()
        assert len(games) == N_games
    finally:
        session.close()

@pytest.mark.integration_test
def test_create_player(operation: Operations):
    session = Session()
    try:
        N_players = session.query(Player).count()
    finally:
        session.close()
    
    operation.create_player('player1')
    
    session = Session()
    try:
        N_players_new = session.query(Player).count()
        assert N_players_new  == N_players + 1
    finally:
        session.close()


@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_create_game(operation: Operations):
    session = Session()
    try:
        N_games = session.query(Game).count()
    finally:
        session.close()
    
    await operation.create_game('partida1', 4,True, '12345')
    
    session = Session()
    try:
        N_games_new = session.query(Game).count()
        for game in session.query(Game).all():
            print(game.name)
        assert N_games_new == N_games + 1
    finally:
        session.close()

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_join_game(operation: Operations):
    session = Session()
    try:
        players_in_1_cnt = session.query(Player).filter(Player.id_partida == 1).count()
            
    finally:
        session.close()
    
    await operation.join_game(1, 1)
    
    session = Session()
    try:
        players_in_1_cnt_new = session.query(Player).filter(Player.id_partida == 1).count()
        assert players_in_1_cnt_new == players_in_1_cnt + 1
    finally:
        session.close()
        
    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 1).one()
        assert player.id_partida == 1
    finally:
        session.close()

    session = Session()
    try:
        game = session.query(Game).filter(Game.id_partida == 1).one()
        player = session.query(Player).filter(Player.id_jugador == 1).one()
        players_in_1 = game.players
        assert player in players_in_1
    finally:
        session.close()
        
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_join_game_player_not_found(operation: Operations):
    with pytest.raises(PlayerNotFoundError):
        await operation.join_game(1, 1000)
        
        
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_join_game_game_not_found(operation: Operations):
    with pytest.raises(GameNotFoundError):
        await operation.join_game(1000, 1)
        