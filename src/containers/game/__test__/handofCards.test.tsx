// librerias
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

import HandOfCards from '/home/joaquin/switcher/front/src/containers/game/components/movementCard/HandOfCards';

jest.mock('axios');
jest.mock('sweetalert2');

describe('HandOfCards Component', () => {
    it('renders content', () => {
        const Cards = [1, 2, 3];

        const component = render(<HandOfCards cards={Cards} />);

        const handOfCards = component.getAllByAltText('carta de movimiento');
        expect(handOfCards.length).toBe(3);
    });

    it('renders no cards when the cards array is empty', () => {
        const Cards = [];

        const component = render(<HandOfCards cards={Cards} />);

        const handOfCards = component.queryAllByAltText('carta de movimiento');
        expect(handOfCards.length).toBe(0);
    });

    it('renders 1 card when we have 1 card left', () => {
        const Cards = [2];

        const component = render(<HandOfCards cards={Cards} />);

        const handOfCards = component.queryAllByAltText('carta de movimiento');
        expect(handOfCards.length).toBe(1);
    });
});





