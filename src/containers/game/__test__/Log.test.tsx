import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Log from '../components/log/Log';
import '@testing-library/jest-dom/';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Log Component', () => {
  beforeEach(() => {
    // Mock localStorage
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'gameId') return '1';
      return null;
    });

    // Mock WebSocket
    global.WebSocket = jest.fn(() => ({
      onopen: jest.fn(),
      onmessage: jest.fn(),
      close: jest.fn(),
    })) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar la interfaz del historial al hacer clic en el icono', () => {
    render(<Log />);
    const logIcon = screen.getByRole('button', { name: /Historial de movimientos/i });
    fireEvent.click(logIcon);
    expect(screen.getByText('Historial de Movimientos')).toBeInTheDocument();
  });

  it('debe cerrar la interfaz del historial al hacer clic en el botón de cerrar', async () => {
    render(<Log />);
    const logIcon = screen.getByRole('button', { name: /Historial de movimientos/i });
    fireEvent.click(logIcon);
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    const logInterface = screen.getByText('Historial de Movimientos').closest('.log-interface');
    await waitFor(() => {
        expect(logInterface).not.toHaveClass('open');
      });
  });

  it('should have a close button with the correct id', () => {
      render(<Log />);
      const logIcon = screen.getByRole('button', { name: /Historial de movimientos/i });
      fireEvent.click(logIcon);
      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toHaveAttribute('class', 'close-btn');
  });

  it("debe cerrar la interfaz del chat al hacer clic fuera de la interfaz", async () => {
    render(<Log />);
    const logIcon = screen.getByRole('button', { name: /Historial de movimientos/i });
    fireEvent.click(logIcon);
    const logInterface = screen.getByText('Historial de Movimientos').closest('.log-interface');
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
        expect(logInterface).not.toHaveClass('open');
      });
  });
});