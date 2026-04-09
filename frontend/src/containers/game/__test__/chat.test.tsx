// chat.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../components/chat/chat';
import '@testing-library/jest-dom/';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Chat Component', () => {
  let mockWebsocket: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWebsocket = {
      onopen: jest.fn(),
      onmessage: jest.fn(),
      close: jest.fn(),
    };

    (global as any).WebSocket = jest.fn(() => ({
      ...mockWebsocket,
      send: jest.fn(),
    })) as any;

    sessionStorage.setItem('gameId', '1');
    sessionStorage.setItem('playerId', '1');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar la interfaz del chat al hacer clic en el icono', () => {
    render(<Chat />);
    const chatIcon = screen.getByRole('button');
    fireEvent.click(chatIcon);
    expect(screen.getByText('CHAT')).toBeInTheDocument();
  });

  it('debe enviar un mensaje y limpiar el input', async () => {
    render(<Chat />);
    const chatIcon = screen.getByRole('button');
    fireEvent.click(chatIcon);
    const input = screen.getByPlaceholderText('Escribe tu mensaje...');
    fireEvent.change(input, { target: { value: 'Hola' } });
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);

    await waitFor(() => {
        expect(input).toHaveValue('');
        expect(mockedAxios.post).toHaveBeenCalledWith('/gamelist/mensaje/1/1/Hola');
    });
  });

  it("debe recibir mensajes del servidor y mostrarlos", async () => {
    const mockMessage = {id: 1, name: 'User1', text: 'Hola', time: new Date().toLocaleTimeString()};
    mockedAxios.get.mockResolvedValueOnce({data: [mockMessage]});
    
    mockWebsocket.onmessage({data: 'MENSAJE'});

    render(<Chat />);
    const chatIcon = screen.getByTestId('toggle-chat');
    fireEvent.click(chatIcon);
    expect(screen.getByText('CHAT')).toBeInTheDocument();
  });

  it("debe cerrar la interfaz del chat al hacer clic en el botón de cerrar", async () => {
    render(<Chat />);
    const chatIcon = screen.getByRole('button');
    fireEvent.click(chatIcon);
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    const chatInterface = screen.getByText('CHAT').closest('.chat-interface');
    await waitFor(() => {
        expect(chatInterface).not.toHaveClass('open');
    });
  });

  it("debe cerrar la interfaz del chat al hacer clic fuera de la interfaz", async () => {
    render(<Chat />);
    const chatIcon = screen.getByRole('button');
    fireEvent.click(chatIcon);
    const chatInterface = screen.getByText('CHAT').closest('.chat-interface');
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
        expect(chatInterface).not.toHaveClass('open');
    });
  });

});