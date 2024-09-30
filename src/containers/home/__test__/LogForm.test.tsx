import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import {LogForm} from '../components/LogForm';
import axios from 'axios';
import { BrowserRouter as Router} from 'react-router-dom';
import Swal from 'sweetalert2';

jest.mock('axios');
jest.mock('sweetalert2');

describe('LogForm Component', () => {
    it('should update name on change', () => {
        render(
            <Router>
                <LogForm />
            </Router>
        );
        const input = document.querySelector('input');
        if(input){   
            fireEvent.change(input, { target: { value: 'New Name' } });
            expect(input.value).toBe('New Name');
        }
    });

    it('should clear userId from localStorage on mount', () => {
        localStorage.setItem('userId', '123');
        render(
            <Router>
                <LogForm />
            </Router>
        );
        expect(localStorage.getItem('userId')).toBeNull();
    });

    it('should submit form and save userId in localStorage', async () => {
        const { getByRole } = render(
            <Router>
                <LogForm />
            </Router>
        );

        const nameInput = document.querySelector('input');
        if(nameInput){
            fireEvent.change(nameInput, { target: { value: 'Test User' } });
        }

        const response = { data: { id: 1 } };
        (axios.post as jest.Mock).mockImplementationOnce(() => Promise.resolve(response));

        const submitButton = getByRole('button', { name: /JUGAR/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/user?name=Test+User', null, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            expect(localStorage.getItem('userId')).toBe('1');
        });
    });

    it('should show error message on submit failure', async () => {
        const { getByRole } = render(
            <Router>
                <LogForm />
            </Router>
        );

        const nameInput = document.querySelector('input');
        if(nameInput){
            fireEvent.change(nameInput, { target: { value: 'Test User' } });
        }

        const error = new Error('Test Error');
        (axios.post as jest.Mock).mockImplementationOnce(() => Promise.reject(error));

        const submitButton = getByRole('button', { name: /JUGAR/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'Oops...',
                text: 'No es posible jugar en este momento :( Inténtalo más tarde',
            });
        });
    });
});