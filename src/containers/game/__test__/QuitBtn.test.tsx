import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QuitBtn from '../components/QuitBtn/QuitBtn'; // Ajusta la ruta de importación según sea necesario

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('QuitBtn Component', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('should render the button correctly', () => {
        const { getByText } = render(<QuitBtn />);
        expect(getByText('ABANDORNAR PARTIDA')).toBeInTheDocument();
    });

    it('should call quit function on button click', async () => {
        const navigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigate);
        localStorage.setItem('userId', '1');
        (axios.put as jest.Mock).mockResolvedValueOnce({ data: {} });

        const { getByText } = render(<QuitBtn />);
        fireEvent.click(getByText('ABANDORNAR PARTIDA'));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/gamelist/leave/1');
            expect(navigate).toHaveBeenCalledWith('/lobby');
        });
    });

});