import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import CreateGame from '../createGame/components/createGame';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Swal from 'sweetalert2';

jest.mock('axios');
jest.mock('sweetalert2');

describe("CreateGame Component", () => {
    it('should update name on change', () => {
        render(
            <Router>
                <CreateGame />
            </Router>
        );
        const input = document.querySelector('input');
        if(input){   
            fireEvent.change(input, { target: { value: 'New Name' } });
            expect(input.value).toBe('New Name');
        }
    });

    it('shoulde update number of players on change', () => {
        render(
            <Router>
                <CreateGame />
            </Router>
        );
        const input = document.querySelector('input');
        if(input){   
            fireEvent.change(input, { target: { value: 3 } });
            expect(input.value).toBe('3');
        }
    });

    it('should submit form', async () => {
        const { getByRole } = render(
            <Router>
                <CreateGame />
            </Router>
        );

        const nameInput = document.querySelector('input');
        if(nameInput){
            fireEvent.change(nameInput, { target: { value: 'Test Game' } });
        }

        const response = { data: { id: 1 } };
        (axios.post as jest.Mock).mockImplementationOnce(() => Promise.resolve(response));

        const submitButton = getByRole('button', { name: /Crear/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/gamelist?name=Test+Game&cant_players=4', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    });

    it('should show error message on submit failure', async () => {
        const { getByRole } = render(
            <Router>
                <CreateGame />
            </Router>
        );

        const nameInput = document.querySelector('input');
        if(nameInput){
            fireEvent.change(nameInput, { target: { value: 'Test Game' } });
        }

        (axios.post as jest.Mock).mockImplementationOnce(() => Promise.reject());

        const submitButton = getByRole('button', { name: /Crear/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'ERROR',
                text: 'Hubo un problema al crear la partida',
            });
        });
    });

    it('should delete game on join error', async () => {
        const { getByRole } = render(
            <Router>
                <CreateGame />
            </Router>
        );

        const nameInput = document.querySelector('input');
        if(nameInput){
            fireEvent.change(nameInput, { target: { value: 'Test Game' } });
        }

        const response = { data: { id: 1 } };
        (axios.post as jest.Mock).mockImplementationOnce(() => Promise.resolve(response));
        (axios.post as jest.Mock).mockImplementationOnce(() => Promise.reject());

        const submitButton = getByRole('button', { name: /Crear/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith("/gamelist/1", {"headers": {"Content-Type": "application/json"}});
        });
    });

});