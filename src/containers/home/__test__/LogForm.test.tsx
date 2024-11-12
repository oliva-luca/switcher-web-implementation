import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { LogForm } from '../components/LogForm';
import { useNavigate, BrowserRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('sweetalert2');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('LogForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form correctly', () => {
    render(
      <Router>
        <LogForm />
      </Router>
    );

    expect(screen.getByPlaceholderText('Ingresar tu nombre')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /JUGAR/i })).toBeInTheDocument();
  });

  it('should handle input change', () => {
    render(
      <Router>
        <LogForm />
      </Router>
    );

    const input = screen.getByPlaceholderText('Ingresar tu nombre');
    fireEvent.change(input, { target: { value: 'John Doe' } });

    expect(input).toHaveValue('John Doe');
  });

  it('should submit the form and navigate to /lobby', async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { userId: '1234' } });

    render(
      <Router>
        <LogForm />
      </Router>
    );

    const input = screen.getByPlaceholderText('Ingresar tu nombre');
    fireEvent.change(input, { target: { value: 'Lionel Messi' } });

    const button = screen.getByRole('button', { name: /JUGAR/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('/lobby');
    });
  });

  it('should handle error when submitting the form', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Async error'));

    render(
      <Router>
        <LogForm />
      </Router>
    );

    const input = screen.getByPlaceholderText('Ingresar tu nombre');
    fireEvent.change(input, { target: { value: 'John Doe' } });

    const button = screen.getByRole('button', { name: /JUGAR/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Oops...',
        text: 'No es posible jugar en este momento :( Inténtalo más tarde',
      });
    });
  });
});