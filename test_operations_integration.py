import pytest
import asyncio
from  sqlalchemy.orm import sessionmaker
from operations import Operations, GameNotFoundError, PlayerNotFoundError, GameStartedError
from models import Game, engine, Base, Player, Tablero, MovCard, FigCard, Casilla 

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
        
    
        
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_start_game(operation: Operations):
    session = Session()
    await operation.start_game(1)
    assert session.query(Game).filter(Game.id_partida == 1).one().started == True
    assert session.query(Game).filter(Game.id_partida == 1).one().tablero is not None
    tablero_game_1 = session.query(Game).filter(Game.id_partida == 1).one().tablero
    
    ocupada = [[False for _ in range(6)] for _ in range(6)]
    color_count = {"azul" : 0,"rojo" : 0,"amarillo" : 0,"verde" : 0}
    for casilla in tablero_game_1.casillas:
        assert ocupada[casilla.fila][casilla.columna]== False
        ocupada[casilla.fila][casilla.columna] = True
        color_count[casilla.color] += 1
    assert color_count["azul"] == 9
    assert color_count["rojo"] == 9
    assert color_count["amarillo"] == 9
    assert color_count["verde"] == 9

    movcards = session.query(MovCard).filter(MovCard.id_partida == 1).all()
    assert len(movcards) == 49

    cantidades = [0] * 7
    for movcard in movcards:
        cantidades[movcard.type - 1] += 1
    
    for cant in cantidades:
        assert cant == 7

    figcards = session.query(FigCard).filter(FigCard.id_partida == 1).all()
    assert len(figcards) == 50

    cantidades = [0] * 25
    for figcard in figcards:
        cantidades[figcard.type - 1] += 1
    
    for cant in cantidades:
        assert cant == 2

    return True

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_start_game_game_not_found(operation: Operations):
    with pytest.raises(GameNotFoundError):
        await operation.start_game(1000)
        
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_start_game_game_already_started(operation: Operations):
    with pytest.raises(GameStartedError):
        await operation.start_game(1)

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_end_turn(operation: Operations):
    session = Session()
    try:
        current_turn = session.query(Game).filter(Game.id_partida == 5).one().turn
        current_position = session.query(Player).filter(Player.id_jugador == current_turn).one().position
    finally:
        session.close()

    await operation.end_turn(5)

    try:
        new_turn = session.query(Game).filter(Game.id_partida == 5).one().turn
        new_position = session.query(Player).filter(Player.id_jugador == new_turn).one().position
        number_of_players = session.query(Game).filter(Game.id_partida == 5).one().cant_jugadores
    finally:
        session.close()

    assert current_turn != new_turn
    assert (current_position + 1) % number_of_players == new_position
    
@pytest.mark.integration_test
def test_get_player(operation: Operations):
    player = operation.get_player(2)
    assert player.id_jugador == 2
    assert player.nombre == 'player2'
    assert player.in_game == False
    assert player.block == False
    assert player.position == None
    assert player.id_partida == None


@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_end_turn_game_not_found(operation: Operations):
    with pytest.raises(GameNotFoundError):
        await operation.end_turn(1000)
        
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_leave_game(operation: Operations):
    session = Session()
    try:
        players_in_1_cnt = session.query(Player).filter(Player.id_partida == 5).count()
    finally:
        session.close()
    
    await operation.leave_game(5)
    
    session = Session()
    try:
        players_in_1_cnt_new = session.query(Player).filter(Player.id_partida == 5).count()
        assert players_in_1_cnt_new == players_in_1_cnt - 1
    finally:
        session.close()
        
    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 5).one()
        assert player.id_partida is None
    finally:
        session.close()

    session = Session()
    try:
        game = session.query(Game).filter(Game.id_partida == 5).one()
        player = session.query(Player).filter(Player.id_jugador == 5).one()
        players_in_1 = game.players
        assert player not in players_in_1
    finally:
        session.close()



@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_leave_lobby(operation: Operations):
    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 4).one()
        game = session.query(Game).filter(Game.id_partida == 5).one()
        players_in_1 = game.players
        assert player in players_in_1
    finally:
        session.close()
    
    await operation.leave_lobby(4)
    
    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 4).one()
        assert player.id_partida == None
        game = session.query(Game).filter(Game.id_partida == 5).one()
        players_in_1 = game.players
        assert player not in players_in_1
    finally:
        session.close()



