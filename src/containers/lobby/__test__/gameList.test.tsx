import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import SlotJoinGame from '../components/gameList/components/slotJoinGame';
import axios from 'axios';
import GameList from '../components/gameList/gameList';
import { FilterProvider } from '../components/filters/FilterContext';

jest.mock('axios');
jest.mock('../components/gameList/components/slotJoinGame', () => jest.fn(() => <div data-testid="slot-join-game"></div>));

const renderGameList = () => {
    render(
    <FilterProvider>
        <GameList />
    </FilterProvider>
    );
};

describe('GameList Component', () => {
    const mockGames = [
        { id_partida: 1, name: 'Game 1', players: [], cant_jugadores: 4, started: false },
        { id_partida: 2, name: 'Game 2', players: [{}, {}], cant_jugadores: 4, started: false },
        { id_partida: 3, name: 'Game 3', players: [{}, {}, {}, {}], cant_jugadores: 4, started: true },
        { id_partida: 4, name: 'Game 4', players: [{}, {}, {}], cant_jugadores: 3, started: false },
      ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and render game list', async () => {
    const mockGames = [
      { id_partida: 1, name: 'Game 1', players: [], cant_jugadores: 4, started: false },
      { id_partida: 2, name: 'Game 2', players: [{}, {}], cant_jugadores: 4, started: false },
      { id_partida: 3, name: 'Game 3', players: [{}, {}, {}, {}], cant_jugadores: 4, started: true },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: mockGames });

    expect(axios.get).not.toHaveBeenCalledWith('/gamelist');
  });

  it('should handle fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Error fetching the game list'));

    renderGameList();

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/gamelist'));
    await waitFor(() => expect(screen.queryByTestId('slot-join-game')).toBeNull());
  });

  it('should filter games correctly', async () => {
    const mockGames = [
      { id_partida: 1, name: 'Game 1', players: [], cant_jugadores: 4, started: false },
      { id_partida: 2, name: 'Game 2', players: [{}, {}], cant_jugadores: 4, started: false },
      { id_partida: 3, name: 'Game 3', players: [{}, {}, {}, {}], cant_jugadores: 4, started: true },
      { id_partida: 4, name: 'Game 4', players: [{}, {}, {}], cant_jugadores: 3, started: false },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: mockGames });

    renderGameList();

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/gamelist'));
    // await waitFor(() => expect(screen.getAllByTestId('slot-join-game')).toHaveLength(3));
  });

  it('should filter games by player count', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockGames });

    renderGameList();

    const filteredGames = mockGames.filter(game => game.cant_jugadores === 4 && !game.started);
    expect(filteredGames).toHaveLength(2);
    expect(filteredGames).toEqual([
      { id_partida: 1, name: 'Game 1', players: [], cant_jugadores: 4, started: false },
      { id_partida: 2, name: 'Game 2', players: [{}, {}], cant_jugadores: 4, started: false },
    ]);
  });

  it('should filter games by name', async () => {    
    (axios.get as jest.Mock).mockResolvedValue({ data: mockGames });

    renderGameList();

    const filteredGames = mockGames.filter(game => game.name.toLowerCase().includes('game 1'.toLowerCase()) && !game.started);
    expect(filteredGames).toHaveLength(1);
    expect(filteredGames).toEqual([
      { id_partida: 1, name: 'Game 1', players: [], cant_jugadores: 4, started: false },
    ]);
  });

  it('should filter games by player count and name', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockGames });

    renderGameList();

    const filteredGames = mockGames.filter(game => game.cant_jugadores === 4 && game.name.toLowerCase().includes('game 2'.toLowerCase()) && !game.started);
    expect(filteredGames).toHaveLength(1);
    expect(filteredGames).toEqual([
      { id_partida: 2, name: 'Game 2', players: [{}, {}], cant_jugadores: 4, started: false },
    ]);
  });

    it('should render all games when no filters are applied', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: mockGames });

        renderGameList();

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/gamelist'));
        await waitFor(() => expect(screen.getAllByTestId('slot-join-game')).toHaveLength(3));
    });

    it('should render no games if all are started', async () => {
        const allStartedGames = [
            { id_partida: 1, name: 'Game 1', players: [], cant_jugadores: 4, started: true },
            { id_partida: 2, name: 'Game 2', players: [{}, {}], cant_jugadores: 4, started: true },
            { id_partida: 3, name: 'Game 3', players: [{}, {}, {}, {}], cant_jugadores: 4, started: true },
        ];

        (axios.get as jest.Mock).mockResolvedValue({ data: allStartedGames });

        renderGameList();

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/gamelist'));
        await waitFor(() => expect(screen.queryByTestId('slot-join-game')).toBeNull());
    });

    it('should render games correctly when only some are started', async () => {
        const mixedGames = [
            { id_partida: 1, name: 'Game 1', players: [], cant_jugadores: 4, started: false },
            { id_partida: 2, name: 'Game 2', players: [{}, {}], cant_jugadores: 4, started: true },
            { id_partida: 3, name: 'Game 3', players: [{}, {}, {}, {}], cant_jugadores: 4, started: false },
        ];

        (axios.get as jest.Mock).mockResolvedValue({ data: mixedGames });

        renderGameList();

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/gamelist'));
        await waitFor(() => expect(screen.getAllByTestId('slot-join-game')).toHaveLength(2));
    });
});