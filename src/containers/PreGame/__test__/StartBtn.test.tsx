import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import StartBtn from '../components/StartBtn/StartBtn'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

jest.mock('axios');
jest.mock('sweetalert2');

describe('StartBtn Component', () => {
    it('should render the button', () => {
        const { getByText } = render(
            <Router>
                <StartBtn />
            </Router>
        );
        expect(getByText('INICIAR PARTIDA')).toBeInTheDocument();
    });

    it('should call start function when button is clicked', async () => {
        render(
            <Router>
                <StartBtn />
            </Router>
        );
        const start = jest.fn();
        const button = document.querySelector('button');
        if(button) {
            button.onclick = start;
            fireEvent.click(button);
        }
        expect(start).toHaveBeenCalled();
    });

    it('should show error message if PUT request fails due to needing more players', async () => {
        localStorage.setItem('gameId', '123');
        const error = {
            response: {
                status: 400,
            },
        };
        (axios.put as jest.Mock).mockRejectedValue(error);

        const { getByText } = render(
            <Router>
                <StartBtn />
            </Router>
        );
        const button = getByText('INICIAR PARTIDA');
        fireEvent.click(button);

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'Error',
                text: 'Se necesitan más jugadores para comenzar',
            });
        });
    });
});