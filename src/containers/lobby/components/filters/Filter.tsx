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