/**
 * @file Este archivo define el contexto de filtros utilizado en la aplicación.
 * Proporciona una interfaz para gestionar el conteo de jugadores y el filtro de nombres.
 */

/**
 * @interface FilterContextProps
 * Define las propiedades del contexto de filtros.
 *
 * @property playerCount - Número o cadena que representa la cantidad de jugadores.
 * @property setPlayerCount - Función para actualizar el número de jugadores.
 * @property nameFilter - Cadena utilizada para filtrar por nombre.
 * @property setNameFilter - Función para actualizar el filtro de nombre.
 */

/**
 * Crea un contexto para los filtros con un valor inicial indefinido.
 */

/**
 * Proveedor del contexto de filtros que envuelve a los componentes hijos.
 *
 * @param children - Componentes hijos que tendrán acceso al contexto de filtros.
 * @returns Proveedor del contexto con los valores actuales de los filtros.
 */

/**
 * Hook personalizado para acceder al contexto de filtros.
 *
 * @returns Las propiedades y métodos del contexto de filtros.
 * @throws Error si el hook se utiliza fuera de un FilterProvider.
 */

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextProps {
  playerCount: number | string;
  setPlayerCount: React.Dispatch<React.SetStateAction<number | string>>;
  nameFilter: string;
  setNameFilter: React.Dispatch<React.SetStateAction<string>>;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playerCount, setPlayerCount] = useState<number | string>("");
  const [nameFilter, setNameFilter] = useState<string>("");

  return (
    <FilterContext.Provider
      value={{ playerCount, setPlayerCount, nameFilter, setNameFilter }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextProps => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
