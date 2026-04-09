import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import StartBtn from '../components/StartBtn/StartBtn';
import '@testing-library/jest-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

jest.mock('axios');
jest.mock('sweetalert2');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));


describe('StartBtn Component', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('should render start button if user is the owner', async () => {
        sessionStorage.setItem('playerId', '1');
        sessionStorage.setItem('gameId', '1');

        const response = { data: { owner: '1' } };
        (axios.get as jest.Mock).mockResolvedValueOnce(response);

        const { getByText } = render(
            <Router>
                <StartBtn />
            </Router>
        );

        await waitFor(() => {
            expect(getByText('INICIAR PARTIDA')).toBeInTheDocument();
        });
    });
        
        it('should render exit button if user is not the owner', async () => {
            sessionStorage.setItem('playerId', '2');
            sessionStorage.setItem('gameId', '1');
            
            const response = { data: { owner: '1' } };
            (axios.get as jest.Mock).mockResolvedValueOnce(response);

        const { getByText } = render(
            <Router>
                <StartBtn />
            </Router>
        );
        
        await waitFor(() => {
            expect(getByText('ABANDONAR PARTIDA')).toBeInTheDocument();
        });
    });
        
    it('should start the game when start button is clicked', async () => {
        sessionStorage.setItem('playerId', '1');
        sessionStorage.setItem('gameId', '1');

        const response = { data: { owner: '1' } };
        (axios.get as jest.Mock).mockResolvedValueOnce(response);
        (axios.put as jest.Mock).mockResolvedValueOnce(() => Promise.resolve({ data: {} }));

        const navigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        const { getByRole } = render(
            <Router>
                <StartBtn />
            </Router>
        );

        await waitFor(() => {
            const startButton = getByRole('button', { name: 'INICIAR PARTIDA' });
            fireEvent.click(startButton);
        });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/gamelist/start/1', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            expect(navigate).toHaveBeenCalledWith('/game');
        });
    });

    it('should show error alert if starting the game fails', async () => {
        sessionStorage.setItem('playerId', '1');
        sessionStorage.setItem('gameId', '1');
        const mockedAxios = jest.mocked(axios, true);
        mockedAxios.get.mockResolvedValueOnce({ data: { owner: '1' } });
        mockedAxios.put.mockRejectedValueOnce(new Error('Network Error'));

        const { getByText } = render(
            <Router>
                <StartBtn />
            </Router>
        );

        await waitFor(() => {
            const startButton = getByText('INICIAR PARTIDA');
            fireEvent.click(startButton);
        });

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'Error',
                text: 'Se necesitan más jugadores para comenzar',
            });
        });
    });

    it('should exit the game when exit button is clicked', async () => {
        sessionStorage.setItem('playerId', '2');
        sessionStorage.setItem('gameId', '1');
        const response = { data: { owner: '1' } };
        (axios.get as jest.Mock).mockResolvedValueOnce(response);
        (axios.put as jest.Mock).mockResolvedValueOnce(() => Promise.resolve({ data: {} }));
        
        const navigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        const { getByRole } = render(
            <Router>
                <StartBtn />
            </Router>
        );

        await waitFor(() => {
            const exitButton = getByRole('button', { name: 'ABANDONAR PARTIDA' });
            fireEvent.click(exitButton);
        });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/gamelist/leave_lobby/2');
            expect(navigate).toHaveBeenCalledWith('/lobby');
        });
    });

    // Additional tests
    it('should handle missing gameId in sessionStorage', async () => {
        sessionStorage.setItem('playerId', 'ownerId');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <Router>
                <StartBtn />
            </Router>
        );

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Game ID not found');
        });

        consoleErrorSpy.mockRestore();
    });

    it('should handle error fetching game data', async () => {
        sessionStorage.setItem('playerId', '1');
        sessionStorage.setItem('gameId', '1');
        const mockedAxios = jest.mocked(axios, true);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(
            <Router>
                <StartBtn />
            </Router>
        );

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching game data:', expect.any(Error));
        });

        consoleErrorSpy.mockRestore();
    });

    it('should handle error when game ID is not found', async () => {
        sessionStorage.removeItem('gameId');
        sessionStorage.setItem('playerId', '1');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
        render(
          <Router>
            <StartBtn />
          </Router>
        );
    
        expect(consoleErrorSpy).toHaveBeenCalledWith('Game ID not found');

    
        consoleErrorSpy.mockRestore();
      });

    it('should handle error when leaving the lobby fails', async () => {
        sessionStorage.setItem('playerId', '2');
        sessionStorage.setItem('gameId', '1');
        const response = { data: { owner: '1' } };
        (axios.get as jest.Mock).mockResolvedValueOnce(response);
        (axios.put as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

        const navigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigate);

        const { getByRole } = render(
            <Router>
                <StartBtn />
            </Router>
        );

        await waitFor(() => {
            const exitButton = getByRole('button', { name: 'ABANDONAR PARTIDA' });
            fireEvent.click(exitButton);
        });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/gamelist/leave_lobby/2');
            expect(navigate).not.toHaveBeenCalled();
        });
    });

});