import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import SlotJoinGame from '../gameList/components/slotJoinGame';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Swal from 'sweetalert2';

jest.mock('axios');
jest.mock('sweetalert2');

describe ('GameList Component', () => {
    it ('should render a list of games', async () => {
        const games = [
            {
                id_partida: 1,
                name: 'Game 1',
                players: 0,
                cant_jugadores: 4
            }
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

});
