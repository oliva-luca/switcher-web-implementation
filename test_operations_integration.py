import pytest
import asyncio
from sqlalchemy.orm import sessionmaker
from exception import *
from operations import Operations
from models import Game, engine, Base, User ,  Player, Tablero, MovCard, FigCard, Casilla, Mensaje 
from utils import modificates

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
def test_create_user(operation: Operations):
    session = Session()
    try:
        N_users = session.query(User).count()
    finally:
        session.close()
    
    operation.create_user('player1')
    
    session = Session()
    try:
        N_users_new = session.query(User).count()
        assert N_users_new  == N_users + 1
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
    
    player_id =  await  operation.join_game(1, 1)
    
    session = Session()
    try:
        players_in_1_cnt_new = session.query(Player).filter(Player.id_partida == 1).count()
        assert players_in_1_cnt_new == players_in_1_cnt + 1
    finally:
        session.close()
        
    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == player_id).one()
        assert player.id_partida == 1
    finally:
        session.close()

    session = Session()
    try:
        game = session.query(Game).filter(Game.id_partida == 1).one()
        player = session.query(Player).filter(Player.id_jugador == player_id).one()
        players_in_1 = game.players
        assert player in players_in_1
    finally:
        session.close()
        
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_join_game_player_not_found(operation: Operations):
    with pytest.raises(UserNotFoundError):
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

    assert tablero_game_1.color_prohibido == None   # No debe haber al inciar

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
    assert player.blocked == False
    assert player.position == None
    assert player.id_partida == 3


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


@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_playmovcard(operation : Operations):
    session = Session()
    try:
        await operation.start_game(3)
        assert session.query(Game).filter(Game.id_partida == 3).one().started == True
        assert session.query(Game).filter(Game.id_partida == 3).one().tablero is not None
        game = session.query(Game).filter(Game.id_partida == 3).one()

        actual_turn = game.turn 

        player = session.query(Player).filter(Player.id_jugador == actual_turn).first()

        player.movcards = player.movcards
        cant_mov_cards = len(player.movcards)
        carta = player.movcards[0]

        assert cant_mov_cards == 3
    finally:
        session.close()

    await operation.playmovcard(3,carta.id_movcard, 10, 11)

    try:
        session = Session()

        carta_por_id = session.query(MovCard).filter(MovCard.id_movcard == carta.id_movcard).one()

        assert carta_por_id.state == True 

    finally:
        session.close()

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_discard_figcard_game_not_found(operation: Operations):
    with pytest.raises(GameNotFoundError):
        await operation.discard_figcard(1000, 1, "rojo")

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_discard_figcard_card_not_found(operation: Operations):
    with pytest.raises(CardNotFoundError):
        await operation.discard_figcard(8, 1, "rojo")  # is from another game

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_discard_figcard_player_not_found(operation: Operations):
    with pytest.raises(PlayerNotFoundError):
        await operation.discard_figcard(8, 104, "rojo")

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_discard_figcard_invalid_card(operation: Operations):
    with pytest.raises(InvalidCardError):
        await operation.discard_figcard(8, 101, "rojo")

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_discard_figcard_not_their_turn(operation: Operations):
    with pytest.raises(NotTheirTurnError):
        await operation.discard_figcard(8, 118, "rojo")

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_discard_figcard(operation : Operations):
    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 10).first()
        cant_figcards = len(player.figcards)
        assert cant_figcards == 24
        tablero = session.query(Game).filter(Game.id_partida == 8).first().tablero
        assert tablero.color_prohibido != "azul"
    finally:
        session.close()

    await operation.discard_figcard(8, 109, "azul")

    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 10).first()
        new_cant_figcards = len(player.figcards)
        assert cant_figcards - 1 == new_cant_figcards
        tablero = session.query(Game).filter(Game.id_partida == 8).first().tablero
        assert tablero.color_prohibido == "azul"
    finally:
        session.close()

@pytest.mark.integration_test

def test_get_logs(operation: Operations):
    logs = operation.get_logs(2)
    assert len(logs) == 0
    
@pytest.mark.integration_test
def test_get_chat(operation: Operations):
    chat = operation.get_chat(1)
    assert len(chat) == 0

@pytest.mark.integration_test
def test_get_logs_2(operation: Operations):
    logs = operation.get_logs(6)
    assert len(logs) == 1
    assert logs[0].id_mensaje == 2
    assert logs[0].type == 0
    assert logs[0].mensaje == 'El jugador 6 ha movido'
    assert logs[0].autor == 'Sistema'
    assert logs[0].time.strftime('%Y-%m-%d %H:%M:%S') == '2021-06-01 12:00:00'
    assert logs[0].id_partida == 6
    assert logs[0].id_autor == None

@pytest.mark.integration_test
def test_get_chat_2(operation: Operations):
    chat = operation.get_chat(6)
    assert len(chat) == 1
    assert chat[0].id_mensaje == 1
    assert chat[0].type == 1
    assert chat[0].mensaje == "Hola, soy el jugador 6"
    assert chat[0].autor == 'player6'
    assert chat[0].time.strftime('%Y-%m-%d %H:%M:%S') == '2021-06-01 12:00:00'
    assert chat[0].id_partida == 6
    assert chat[0].id_autor == 6
    
@pytest.mark.integration_test
def test_get_logs_game_not_found(operation: Operations):
    with pytest.raises(GameNotFoundError):
        operation.get_logs(1000)

@pytest.mark.integration_test
def test_get_chat_game_not_found(operation: Operations):
    with pytest.raises(GameNotFoundError):
        operation.get_chat(1000)

@pytest.mark.asyncio
async def test_block_figcard_game_not_found(operation: Operations):
    with pytest.raises(GameNotFoundError):
        await operation.block_figcard(1000, 1, "rojo")

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_block_figcard_card_not_found(operation: Operations):
    with pytest.raises(CardNotFoundError):
        await operation.block_figcard(8, 1, "rojo")  # is from another game

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_block_figcard_player_not_found(operation: Operations):
    with pytest.raises(PlayerNotFoundError):
        await operation.block_figcard(8, 104, "rojo")

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_block_figcard_invalid_card(operation: Operations):
    with pytest.raises(InvalidCardError):
        await operation.block_figcard(8, 101, "rojo")

@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_block_figcard_not_block_theirself(operation: Operations):
    with pytest.raises(InvalidBlockError):
        await operation.block_figcard(8, 115, "rojo")

# Test de no bloquear si el jugador ya está bloqueado
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_block_already_blocked_player(operation : Operations):
    session = Session()
    # Bloqueo al jugador 11
    try:
        player = session.query(Player).filter(Player.id_jugador == 11).first()
        player.blocked = True
        session.commit()
    finally:
        session.close()

    # Intento bloquarlo
    session = Session()
    try:
        with pytest.raises(InvalidBlockError):
            await operation.block_figcard(8, 144, "rojo")
    finally:
        player = session.query(Player).filter(Player.id_jugador == 11).first()
        player.blocked = False # Lo desbloqueo
        session.commit()
        session.close()

# Test de no bloquear si quedan menos de 3 cartas
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_not_block_if_less_three_cards(operation : Operations):
    session = Session()
    # Le saco cartas al jugador 11
    try:
        # Preparacion previa
        figcards = session.query(FigCard).filter(FigCard.id_jugador == 11).all()
        assert len(figcards) >= 4
        for figcard in figcards:
            if not figcard.shown:
                figcard.id_jugador = None # Dejo solo las 3 visibiles
        session.commit()

        # Le voy sacando cartas e intento bloquearlo
        # Primero le saco las mostradas
        shown_figcards = [figcard for figcard in figcards if figcard.shown]
        # Vamos a testear con 2 y 1 cartas
        for index in range(2):
            shown_figcards[index].id_jugador = None
            session.commit()
            with pytest.raises(InvalidBlockError):
                await operation.block_figcard(8, shown_figcards[-1].id_figcard, "rojo")
    finally:
        for figcard in figcards:
            figcard.id_jugador = 11 # Le devuelvo sus cartas
        session.commit()
        session.close()

# Test de que se bloquee todo correctamente
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_block_figcard(operation : Operations):
    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 11).first()
        assert not player.blocked
        figcard = session.query(FigCard).filter(FigCard.id_figcard == 144).first()
        assert not figcard.blocked
        tablero = session.query(Game).filter(Game.id_partida == 8).first().tablero
        assert tablero.color_prohibido != "verde"
    finally:
        session.close()

    await operation.block_figcard(8, 144, "verde")

    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 11).first()
        assert player.blocked
        figcard = session.query(FigCard).filter(FigCard.id_figcard == 144).first()
        assert figcard.blocked
        tablero = session.query(Game).filter(Game.id_partida == 8).first().tablero
        assert tablero.color_prohibido == "verde"
    finally:
        session.close()
# Test de desbloqueo de carta de figura
# Tiene que correrse despues del test anterior
@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_unblock_figcard(operation : Operations):
    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 11).first()
        assert player.blocked
        figcards = session.query(FigCard).filter((FigCard.id_jugador == player.id_jugador) & FigCard.shown).all()
        unblocked_figcards = [figcard for figcard in figcards if not figcard.blocked]
        blocked_figcards = [figcard for figcard in figcards if figcard.blocked]
        assert len(blocked_figcards) == 1
        for figcard in unblocked_figcards:
            figcard.player = None
        game = session.query(Game).filter(Game.id_partida == 8).first()
        game.turn = 11
        session.commit()
    finally:
        session.close()

    await operation.discard_figcard(8, 144, "azul")

    session = Session()
    try:
        player = session.query(Player).filter(Player.id_jugador == 11).first()
        assert not player.blocked   # se debloquea el jugador
        figcards = session.query(FigCard).filter((FigCard.id_jugador == player.id_jugador) & FigCard.shown).all()
        assert len(figcards) == 0   # no tiene cartas mostradas
    finally:
        session.close()

    await operation.end_turn(8)

    session = Session()
    try:
        figcards = session.query(FigCard).filter((FigCard.id_jugador == player.id_jugador) & FigCard.shown).all()
        assert len(figcards) == 3   # se le rellenaron al terminar el turno
    finally:
        session.close()


# @pytest.mark.integration_test
# @pytest.mark.asyncio
# async def test_cancel_partial_moves(operation: Operations):
#     session = Session()
#     game = session.query(Game).filter(Game.id_partida == 7).first()
#     try:
#         assert game is not None
#         id_tablero = game.id_tablero

#         modificates.add_modify(id_tablero, 1, 2, 3)
#         modificates.add_modify(id_tablero, 4, 5, 6)

#         assert len(modificates.get_game_modifies(id_tablero)) == 2
#     finally:
#         session.close()

#     await operation.cancel_partial_moves(id_tablero)

#     try:
#         assert game is not None
#         assert len(modificates.get_game_modifies(game.id_tablero)) == 0
#     finally:
#         session.close()



@pytest.mark.integration_test
@pytest.mark.asyncio
async def test_send_message(operation: Operations):
    session = Session()
    try:
        N_mensajes = session.query(Mensaje).filter(Mensaje.id_partida == 1, Mensaje.type == 1).count()
    finally:
        session.close()
    
    await operation.send_message('1', '1', 'mensaje1')
    
    session = Session()
    try:
        N_mensajes_new = session.query(Mensaje).filter(Mensaje.id_partida == 1, Mensaje.type == 1).count()
        assert N_mensajes_new  == N_mensajes + 1
    finally:
        session.close()


