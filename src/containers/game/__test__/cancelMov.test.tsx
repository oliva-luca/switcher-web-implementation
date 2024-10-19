import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CancelMov from '../components/cancelMov/cancelMov';

jest.mock('axios');

describe('CancelMov Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('gameId', '12345');
  });

    it('should call axios.put with the correct URL when button is clicked', async () => {
        axios.put.mockResolvedValue({});

        const { getByRole } = render(<CancelMov />);
        const button = getByRole('button', { name: 'CANCELAR MOVIMIENTOS' });

        fireEvent.click(button);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/gamelist/cancelmoves/12345');
        });
    });

    it('should log error to console when axios.put fails', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        axios.put.mockRejectedValue(new Error('Network Error'));

        const { getByRole } = render(<CancelMov />);
        const button = getByRole('button', { name: 'CANCELAR MOVIMIENTOS' });

        fireEvent.click(button);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(new Error('Network Error'));
        });

        consoleSpy.mockRestore();
    });

});