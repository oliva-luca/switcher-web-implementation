import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import SlotJoinGame from '../gameList/components/slotJoinGame';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Swal from 'sweetalert2';

jest.mock('axios');
jest.mock('sweetalert2');

describe('GameList Component', () => {
  it('should render a list of games', async () => {
    const games = [
      {
        id_partida: 1,
        name: 'Game 1',
        players: 0,
        cant_jugadores: 4,
      },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: games });

    const { getByRole } = render(
      <Router>
        <SlotJoinGame
          id={games[0].id_partida}
          name={games[0].name}
          currentCapacity={games[0].players}
          capacity={games[0].cant_jugadores}
        />
      </Router>
    );

    const slots = await getByRole('article');
    expect(slots).toBeInTheDocument();
  });

  it('should render multiple SlotJoinGame components', async () => {
    const games = [
      { id_partida: 1, name: 'Game 1', players: 2, cant_jugadores: 4 },
      { id_partida: 2, name: 'Game 2', players: 3, cant_jugadores: 5 },
      { id_partida: 3, name: 'Game 3', players: 1, cant_jugadores: 3 },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: games });

    render(
      <Router>
        {games.map((game) => (
          <SlotJoinGame
            key={game.id_partida}
            id={game.id_partida}
            name={game.name}
            currentCapacity={game.players}
            capacity={game.cant_jugadores}
          />
        ))}
      </Router>
    );

    await waitFor(() => {
      games.forEach((game) => {
        expect(screen.getByText(game.name)).toBeInTheDocument();
      });
    });
  });

  it('should display correct data for each SlotJoinGame', async () => {
    const games = [
      { id_partida: 1, name: 'Game 1', players: 2, cant_jugadores: 4 },
      { id_partida: 2, name: 'Game 2', players: 3, cant_jugadores: 5 },
      { id_partida: 3, name: 'Game 3', players: 1, cant_jugadores: 3 },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: games });

    render(
      <Router>
        {games.map((game) => (
          <SlotJoinGame
            key={game.id_partida}
            id={game.id_partida}
            name={game.name}
            currentCapacity={game.players}
            capacity={game.cant_jugadores}
          />
        ))}
      </Router>
    );

    await waitFor(() => {
      games.forEach((game) => {
        expect(screen.getByText(game.name)).toBeInTheDocument();
        expect(screen.getByText(`${game.players}/${game.cant_jugadores}`)).toBeInTheDocument();
      });
    });
  });

  it('should handle no games available', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <Router>
        <SlotJoinGame
          id={0}
          name="No games available"
          currentCapacity={0}
          capacity={0}
        />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('No games available')).toBeInTheDocument();
    });
  });

    it('should join a game', async () => {
        const game = {
        id_partida: 1,
        name: 'Game 1',
        players: 2,
        cant_jugadores: 4,
        };
    
        (axios.post as jest.Mock).mockResolvedValue({ data: { id: 1 } });
    
        render(
        <Router>
            <SlotJoinGame
            id={game.id_partida}
            name={game.name}
            currentCapacity={game.players}
            capacity={game.cant_jugadores}
            />
        </Router>
        );
    
        const joinButton = screen.getByRole('button', { name: /Unirse/i });
        fireEvent.click(joinButton);
    
        await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
        });
    });
});