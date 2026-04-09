import React, { createContext, useContext, useState, ReactNode } from "react";

interface CurrentPlayContextProps {
  selectedCard: [number, number] | null;
  setSelectedCard: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;

  selectedTyle: [number, number, number] | null;
  setSelectedTyle: React.Dispatch<
    React.SetStateAction<[number, number, number] | null>
  >;

  currentTurn: number | null;
  setCurrentTurn: React.Dispatch<React.SetStateAction<number | null>>;

  selectedFigureCard: [number, number, boolean] | null;
  setSelectedFigureCard: React.Dispatch<
    React.SetStateAction<[number, number, boolean] | null>
  >;
}

const CurrentPlayContext = createContext<CurrentPlayContextProps | undefined>(
  undefined
);

export const CurrentPlayProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCard, setSelectedCard] = useState<[number, number] | null>(
    null
  );

  const [selectedTyle, setSelectedTyle] = useState<
    [number, number, number] | null
  >(null);

  const [currentTurn, setCurrentTurn] = useState<number | null>(null);

  const [selectedFigureCard, setSelectedFigureCard] = useState<
    [number, number, boolean] | null
  >(null);

  return (
    <CurrentPlayContext.Provider
      value={{
        selectedCard,
        setSelectedCard,
        selectedTyle,
        setSelectedTyle,
        currentTurn,
        setCurrentTurn,
        selectedFigureCard,
        setSelectedFigureCard,
      }}
    >
      {children}
    </CurrentPlayContext.Provider>
  );
};

export const useCurrentPlay = () => {
  const context = useContext(CurrentPlayContext);
  if (!context) {
    throw new Error("useCurrentPlay must be used within a CurrentPlayProvider");
  }
  return context;
};
