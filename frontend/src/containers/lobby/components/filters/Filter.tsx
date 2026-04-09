/**
 * Componente de filtro para la pantalla de lobby.
 * 
 * Este componente permite filtrar jugadores por nombre y cantidad de jugadores.
 * Utiliza el contexto `useFilter` para manejar los estados de los filtros.
 * 
 * @component
 * 
 * @example
 * <Filter />
 * 
 * @returns {JSX.Element} El componente de filtro.
 * 
 * @remarks
 * - El filtro de cantidad de jugadores permite valores entre 2 y 4.
 * - El filtro de nombre permite filtrar jugadores por su nombre.
 * 
 * @function
 * @name Filter
 * 
 * @hook
 * @name useFilter
 * @description Hook que proporciona los estados y funciones para manejar los filtros.
 * 
 * @typedef {Object} FilterContext
 * @property {number|string} playerCount - El número de jugadores filtrado.
 * @property {function} setPlayerCount - Función para actualizar el número de jugadores.
 * @property {string} nameFilter - El nombre filtrado.
 * @property {function} setNameFilter - Función para actualizar el nombre filtrado.
 * 
 * @param {React.ChangeEvent<HTMLInputElement>} event - El evento de cambio del input.
 * 
 * @function
 * @name handlePlayerCountChange
 * @description Maneja el cambio en el input de cantidad de jugadores.
 * 
 * @function
 * @name handleNameFilterChange
 * @description Maneja el cambio en el input de filtro de nombre.
 */
import React from 'react';
import { useFilter } from './FilterContext'; // Ajusta la ruta según sea necesario
import './Filter.css'; // Ajusta la ruta según sea necesario

const Filter: React.FC = () => {
    const { playerCount, setPlayerCount, nameFilter, setNameFilter } = useFilter();

    const handlePlayerCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(event.target.value, 10);

        if (isNaN(value)) {
            setPlayerCount('');
        } else if (value < 2) {
            setPlayerCount(2);
        } else if (value > 4) {
            setPlayerCount(4);
        } else {
            setPlayerCount(value);
        }
    };

    const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilter(event.target.value);
    };

    return (
        <div className="nameFilter">
            <input
                type="text"
                id="nameInput"
                data-testid="nameFilter"
                placeholder="Filtrar por nombre"
                value={nameFilter}
                onChange={handleNameFilterChange}
            />
            <input
                type="number"
                id="playerCountInput"
                placeholder="Cantidad de jugadores"
                min="2"
                max="4"
                value={playerCount}
                onChange={handlePlayerCountChange}
            />
        </div>
    );
};

export default Filter;