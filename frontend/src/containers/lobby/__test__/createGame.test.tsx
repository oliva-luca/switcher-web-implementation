import React from 'react';
import { render, fireEvent, waitFor, getByRole } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import CreateGame from '../components/createGame/createGame';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Swal from 'sweetalert2';

jest.mock('axios');
jest.mock('sweetalert2');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

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
        const { getByRole } = render(
            <Router>
                <CreateGame />
            </Router>
        );
        const input = getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '3' } });
        expect(input.value).toBe('3');
        fireEvent.change(input, { target: { value: '5' } });
        expect(input.value).toBe('4');
        fireEvent.change(input, { target: { value: '1' } });
        expect(input.value).toBe('2');
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
            expect(axios.post).toHaveBeenCalledWith('/gamelist?name=Test+Game&cant_players=4&priv=false&psw=', {
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

    it('should update isPrivate on checkbox change', () => {
        const { getByRole } = render(
            <Router>
                <CreateGame />
            </Router>
        );
        const checkbox = getByRole('switch');
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(false);
    });

    it('should update the password on input change', () => {
        render(
            <Router>
                <CreateGame />
            </Router>
        );
        const input = document.querySelector('input[type="password"]');

        if(input){
            fireEvent.change(input, { target: { value: 'newpassword' } });
            expect(input.value).toBe('newpassword');
        }
      });

});