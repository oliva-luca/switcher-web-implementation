import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FigureBoard from '../components/mainBoard/FigureBoard';
import FigureCard from '../components/mainBoard/FigureCard';
import { FigCard } from '../utils/interfaces';

jest.mock('../components/mainBoard/FigureCard', () => {
  return jest.fn(() => <div data-testid="figure-card"></div>);
});

describe('FigureBoard Component', () => {
  const mockCards: FigCard[] = [
    {
        id_figcard: 1, type: 5, id_jugador: 1,
        shown: true,
        id_partida: 0
    },
    {
        id_figcard: 2, type: 3, id_jugador: 1,
        shown: true,
        id_partida: 0
    },
    {
        id_figcard: 3, type: 2, id_jugador: 1,
        shown: true,
        id_partida: 0
    },
  ];

  it('should render the FigureBoard component with pos "btm"', () => {
    render(<FigureBoard pos="btm" deck={10} cards={mockCards} name="Player 1" />);
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByTestId('figure-card').length).toBe(3);
  });

  it('should render the FigureBoard component with pos "rgt"', () => {
    render(<FigureBoard pos="rgt" deck={20} cards={mockCards} name="Player 2" />);
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getAllByTestId('figure-card').length).toBe(3);
  });

  it('should render the FigureBoard component with pos "top"', () => {
    render(<FigureBoard pos="top" deck={30} cards={mockCards} name="Player 3" />);
    expect(screen.getByText('Player 3')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getAllByTestId('figure-card').length).toBe(3);
  });

  it('should render the FigureBoard component with pos "lft"', () => {
    render(<FigureBoard pos="lft" deck={40} cards={mockCards} name="Player 4" />);
    expect(screen.getByText('Player 4')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getAllByTestId('figure-card').length).toBe(3);
  });
});