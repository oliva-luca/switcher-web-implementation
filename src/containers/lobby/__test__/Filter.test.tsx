import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filter from '../components/filters/Filter';
import { FilterProvider, useFilter } from '../components/filters/FilterContext';


// Mock del contexto
const mockSetPlayerCount = jest.fn();
const mockSetNameFilter = jest.fn();

const renderFilter = () => {
    render(
      <FilterProvider>
        <Filter />
      </FilterProvider>
    );
  };

describe('Filter Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should render Filter component', () => {
      renderFilter();
  
      expect(screen.getByPlaceholderText('Filtrar por nombre')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Cantidad de jugadores')).toBeInTheDocument();
    });
  
    it('should update name filter on input change', () => {
      renderFilter();
  
      const nameInput = screen.getByPlaceholderText('Filtrar por nombre');
      fireEvent.change(nameInput, { target: { value: 'test' } });
  
      expect(nameInput.value).toBe('test');
    });
  
    it('should update player count on input change', () => {
      renderFilter();
  
      const playerCountInput = screen.getByPlaceholderText('Cantidad de jugadores');
      fireEvent.change(playerCountInput, { target: { value: '3' } });
  
      expect(playerCountInput.value).toBe('3');
    });
  
    it('should set player count to 2 if input is less than 2', () => {
      renderFilter();
  
      const playerCountInput = screen.getByPlaceholderText('Cantidad de jugadores');
      fireEvent.change(playerCountInput, { target: { value: '1' } });
  
      expect(playerCountInput.value).toBe('2');
    });
  
    it('should set player count to 4 if input is greater than 4', () => {
      renderFilter();
  
      const playerCountInput = screen.getByPlaceholderText('Cantidad de jugadores');
      fireEvent.change(playerCountInput, { target: { value: '5' } });
  
      expect(playerCountInput.value).toBe('4');
    });
  
    it('should set player count to empty string if input is not a number', () => {
      renderFilter();
  
      const playerCountInput = screen.getByPlaceholderText('Cantidad de jugadores');
      fireEvent.change(playerCountInput, { target: { value: 'abc' } });
  
      expect(playerCountInput.value).toBe('');
    });
  });