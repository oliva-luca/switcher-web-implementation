import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CantPlayer from '../components/CantPlayer/CantPlayer';

jest.mock('axios');

describe('CantPlayer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem('gameId', '123');
  });

  it('should fetch and display game data', async () => {
    const mockResponse = {
      data: {
        players: [{}, {}, {}],
        cant_jugadores: 4,
      },
    };
    axios.get.mockResolvedValue(mockResponse);

    const { getByText } = render(<CantPlayer />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/gamelist/123');
      expect(getByText('CONECTADOS 3/4')).toBeInTheDocument();
    });
  });

  it('should handle fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Error fetching game data'));

    const { getByText } = render(<CantPlayer />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/gamelist/123');
      expect(getByText('CONECTADOS 0/0')).toBeInTheDocument();
    });
  });
});