import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Timer from '../components/Timer/Timer';
import axios from 'axios';
import { CurrentPlayProvider } from '../hooks/CurrentPlay.context';

jest.mock('axios');
jest.useFakeTimers();

describe('Timer Component', () => {
    beforeEach(() => {
        localStorage.setItem('gameId', 'testGameId');
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.resetAllMocks();
    });

    it('should render the initial time correctly', () => {
        render(
            <CurrentPlayProvider>
                <Timer />
            </CurrentPlayProvider>
        );
        expect(screen.getByText('2:00')).toBeInTheDocument();
    });

    it('should decrease the timer every second', () => {
        render(
            <CurrentPlayProvider>
                <Timer />
            </CurrentPlayProvider>
        );
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText('1:59')).toBeInTheDocument();
    });

    it('should reset the timer when a message is received via WebSocket', () => {
        const mockSocket = new WebSocket('ws://localhost:8000/ws/game/testGameId');
        render(
            <CurrentPlayProvider>
                <Timer />
            </CurrentPlayProvider>
        );
        act(() => {
            if (mockSocket.onmessage) {
                mockSocket.onmessage(new MessageEvent('message', { data: '' }));
            }
        });
        expect(screen.getByText('2:00')).toBeInTheDocument();
    });

    it('should call endTurn when the timer reaches zero', async () => {
        axios.put.mockResolvedValueOnce({});
        render(
            <CurrentPlayProvider>
                <Timer />
            </CurrentPlayProvider>
        );
        act(() => {
            jest.advanceTimersByTime(120000);
        });
        expect(axios.put).toHaveBeenCalledWith('/end_turn/testGameId');
    });
});