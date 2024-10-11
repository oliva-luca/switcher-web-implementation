import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextProps {
    playerCount: number | string;
    setPlayerCount: React.Dispatch<React.SetStateAction<number | string>>;
    nameFilter: string;
    setNameFilter: React.Dispatch<React.SetStateAction<string>>;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [playerCount, setPlayerCount] = useState<number | string>('');
    const [nameFilter, setNameFilter] = useState<string>('');

    return (
        <FilterContext.Provider value={{ playerCount, setPlayerCount, nameFilter, setNameFilter }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = (): FilterContextProps => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};