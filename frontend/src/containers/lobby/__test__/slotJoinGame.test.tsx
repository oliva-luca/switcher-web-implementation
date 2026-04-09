import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import SlotJoinGame from '../components/gameList/components/slotJoinGame';
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

    it('should change background color on mouse over', () => {
      const game = {
        id_partida: 1,
        name: 'Game 1',
        players: 2,
        cant_jugadores: 4,
      };
  
      const { getByRole } = render(
      <Router>
          <SlotJoinGame
          id={game.id_partida}
          name={game.name}
          currentCapacity={game.players}
          capacity={game.cant_jugadores}
          />
      </Router>
      );
      const slot = getByRole('button', { name: /Unirse/i });
  
      fireEvent.mouseOver(slot);
  
      expect(slot.style.background).toBe('rgb(110, 197, 225)');
    });
  
    it('should restore background color on mouse out', () => {
        const game = {
          id_partida: 1,
          name: 'Game 1',
          players: 2,
          cant_jugadores: 4,
        };
    
        const { getByRole } = render(
        <Router>
            <SlotJoinGame
            id={game.id_partida}
            name={game.name}
            currentCapacity={game.players}
            capacity={game.cant_jugadores}
            />
        </Router>
        );
        
        const slot = getByRole('button', { name: /Unirse/i });
  
      fireEvent.mouseOver(slot);
      fireEvent.mouseOut(slot);
  
      expect(slot.style.background).toBe('rgb(126, 182, 91)');
    });

    it('should show error alert on join game error', async () => {
      (axios.put as jest.Mock).mockRejectedValueOnce({});
  
      const game = {
        id_partida: 1,
        name: 'Game 1',
        players: 1,
        cant_jugadores: 2,
      };
  
      const { getByRole } = render(
      <Router>
          <SlotJoinGame
          id={game.id_partida}
          name={game.name}
          currentCapacity={game.players}
          capacity={game.cant_jugadores}
          />
      </Router>
      );
      
      const slot = getByRole('button', { name: /Unirse/i });
  
      fireEvent.click(slot);
  
      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al unirse al juego. Por favor, inténtalo de nuevo.',
        });
      });
    });
    
    it('should prompt for password when game is private', async () => {
      Swal.fire.mockResolvedValue({ isConfirmed: true, value: 'correct_password' });
  
      const { getByRole } = render(
        <Router>
          <SlotJoinGame id="1" name="Test Game" currentCapacity={2} capacity={4} is_private={true} password="correct_password" />
        </Router>
      );
  
      fireEvent.click(getByRole('button', { name: /Unirse/i }));
  
      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith({
          title: 'Ingrese la contraseña',
          input: 'password',
          confirmButtonText: 'Unirse',
          confirmButtonColor: '#7eb65b',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          inputValidator: expect.any(Function),
        });
      });
    });
  
    it('should show error if password is incorrect', async () => {
      Swal.fire
        .mockResolvedValueOnce({ isConfirmed: true, value: 'wrong_password' })
        .mockResolvedValueOnce({ isConfirmed: true });
  
      const { getByRole } = render(
        <Router>
          <SlotJoinGame id="1" name="Test Game" currentCapacity={2} capacity={4} is_private={true} password="correct_password" />
        </Router>
      );
  
      fireEvent.click(getByRole('button', { name: /Unirse/i }));
  
      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith({
          icon: 'error',
          title: 'Contraseña incorrecta',
          text: 'Por favor, intenta de nuevo.',
        });
      });
    });
  
    it('should return an error message if the input is empty', async () => {
      Swal.fire
        .mockResolvedValueOnce({ isConfirmed: true, value: '' })
        .mockResolvedValueOnce({ isConfirmed: true });
  
      const { getByRole } = render(
        <Router>
          <SlotJoinGame id="1" name="Test Game" currentCapacity={2} capacity={4} is_private={true} password="correct_password" />
        </Router>
      );
  
      fireEvent.click(getByRole('button', { name: /Unirse/i }));
  
      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith({
          title: 'Ingrese la contraseña',
          input: 'password',
          confirmButtonText: 'Unirse',
          confirmButtonColor: '#7eb65b',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          inputValidator: expect.any(Function),
        });
      });

      const inputValidator = Swal.fire.mock.calls[0][0].inputValidator as (value: string) => string | null;
      if (inputValidator) {
        expect(inputValidator('')).toBe('Debes ingresar una contraseña');
      }

    });

});