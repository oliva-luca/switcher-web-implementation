import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import axios from 'axios';
import InGameList from '../components/inGameList/InGameList';
import SlotJoinStartedGame from '../components/inGameList/slotJoinStartedGame';

jest.mock('axios');
jest.mock('../components/inGameList/slotJoinStartedGame', () => jest.fn(() => <div data-testid="slot-join-started-game"></div>));


describe('InGameList Component', () => {
    const mockUserData = [
      {
        id_user: 1,
        nombre: 'User 1',
        players: [
          { nombre: 'Player 1', in_game: true, id_partida: 1, id_jugador: 1, block: false, user_id: 1 },
        ],
      },
    ];
  
    const mockGameList = [
      { id_partida: 1, name: 'Game 1', players: [{}, {}], cant_jugadores: 4, started: false },
      { id_partida: 2, name: 'Game 2', players: [{}, {}, {}], cant_jugadores: 4, started: false },
      { id_partida: 3, name: 'Game 3', players: [{}, {}, {}, {}], cant_jugadores: 4, started: true },
    ];
  
    beforeEach(() => {
      jest.clearAllMocks();
      localStorage.setItem('userId', '1'); // Simula un usuario en sesión
    });
  
    it('should fetch and render the user and game lists', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUserData });
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockGameList });
  
      render(<InGameList />);
  
      await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/user'));
      await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/gamelist'));
  
      // El componente debería mostrar solo las partidas no iniciadas que el usuario no ha unido
      await waitFor(() => expect(screen.getAllByTestId('slot-join-started-game')).toHaveLength(3)); // Filtra correctamente
    });

  it('should render only games that the user has not joined', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUserData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockGameList });

    render(<InGameList />);

    const filteredGames = mockGameList.filter((game) => game.id_partida !== 1 && !game.started);
    await waitFor(() => expect(screen.getAllByTestId('slot-join-started-game')).toHaveLength(3));
  });

  it('should handle fetch errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('Fetch error'));

    render(<InGameList />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/user'));
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/gamelist'));
    await waitFor(() => expect(screen.queryByTestId('slot-join-started-game')).toBeNull());
  });

  it('should render all games when the user has not joined any', async () => {
    const mockUserDataEmpty = [{ id_user: 1, nombre: 'User 1', players: [] }];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUserDataEmpty });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockGameList });

    render(<InGameList />);

    await waitFor(() => expect(screen.getAllByTestId('slot-join-started-game')).toHaveLength(3));
  });
});
