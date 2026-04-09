import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import CancelBtn from '../components/CancelBtn/CancelBtn';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockAxios = new MockAdapter(axios);

describe('CancelBtn', () => {
    beforeEach(() => {
        sessionStorage.setItem('playerId', '1');
        sessionStorage.setItem('gameId', '123');
    });

    afterEach(() => {
        sessionStorage.clear();
        mockAxios.reset();
    });

    describe('when the user is the owner', () => {
        it('renders the button', async () => {
            mockAxios.onGet('/gamelist/123').reply(200, { owner: '1' });

            render(
                <MemoryRouter>
                    <CancelBtn />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('CANCELAR PARTIDA')).toBeInTheDocument();
            });
        });

        it('calls cancel function when button is clicked', async () => {
            const navigate = jest.fn();
            (useNavigate as jest.Mock).mockReturnValue(navigate);
            mockAxios.onGet('/gamelist/123').reply(200, { owner: '1' });
            mockAxios.onPut('/gamelist/leave_lobby/1').reply(200);

            render(
                <MemoryRouter>
                    <CancelBtn />
                </MemoryRouter>
            );

            
            await waitFor(() => {
                expect(screen.getByText('CANCELAR PARTIDA')).toBeInTheDocument();                
            });

            fireEvent.click(screen.getByText('CANCELAR PARTIDA'));

            await waitFor(() => {
                expect(navigate).toHaveBeenCalledWith('/lobby');
            }); 
        });

        it('handles error when canceling the game', async () => {
            mockAxios.onGet('/gamelist/123').reply(200, { owner: '1' });
            mockAxios.onPut('/gamelist/leave_lobby/1').reply(500);

            render(
                <MemoryRouter>
                    <CancelBtn />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('CANCELAR PARTIDA')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('CANCELAR PARTIDA'));

            await waitFor(() => {
                expect(screen.getByText('Error al cancelar la partida')).toBeInTheDocument();
            });
        });

        it('handles error when gameId is not found', async () => {

            sessionStorage.removeItem('gameId');
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            render(
                <MemoryRouter>
                    <CancelBtn />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith('Game ID not found');
            });
        });

        it('handles error when get ownerId fails', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            mockAxios.onGet('/gamelist/123').reply(500);

            render(
                <MemoryRouter>
                    <CancelBtn />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching game data:', expect.any(Error));
            });
        });
        
    });

    describe('when the user is not the owner', () => {
        it('does not render the button', async () => {
            mockAxios.onGet('/gamelist/123').reply(200, { owner: '2' });
            // set mi id to 1

            render(
                <MemoryRouter>
                    <CancelBtn />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.queryByText('CANCELAR PARTIDA')).not.toBeInTheDocument();
            });
        });
    });
});