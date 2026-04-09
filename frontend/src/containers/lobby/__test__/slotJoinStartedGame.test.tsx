import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import SlotJoinStartedGame from '../components/inGameList/slotJoinStartedGame';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

jest.mock('axios');
jest.mock('sweetalert2');

jest.mock("react-router-dom", () => {
  const actual: { [key: string]: any } = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('SlotJoinStartedGame Component', () => {

  it('should render the component correctly', () => {
    render(
      <Router>
        <SlotJoinStartedGame
          id={1}
          name="Test Game"
          started={false}
          playerId={1}
        />
      </Router>
    );

    expect(screen.getByText('Re-Join Game (Test Game)')).toBeInTheDocument();
  });
  
  it('should navigate to /pregame when game has not started', async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <Router>
        <SlotJoinStartedGame
          id={1}
          name="Test Game"
          started={false}
          playerId={1}
        />
      </Router>
    );

    fireEvent.click(screen.getByText('Re-Join Game (Test Game)'));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/pregame'));
  });


  it('should navigate to /game when game has started', async () => {
    const navigate = jest.fn();

    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <Router>
        <SlotJoinStartedGame
          id={1}
          name="Test Game"
          started={true}
          playerId={1}
        />
      </Router>
    );

    fireEvent.click(screen.getByText('Re-Join Game (Test Game)'));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/game'));
  });
});