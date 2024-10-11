import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedCardContextProps {
  selectedCard: [number, number] | null;
  setSelectedCard: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
}

const SelectedCardContext = createContext<SelectedCardContextProps | undefined>(
  undefined
);

export const SelectedCardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCard, setSelectedCard] = useState<[number, number] | null>(
    null
  );

  return (
    <SelectedCardContext.Provider value={{ selectedCard, setSelectedCard }}>
      {children}
    </SelectedCardContext.Provider>
  );
};

export const useSelectedCard = () => {
  const context = useContext(SelectedCardContext);
  if (!context) {
    throw new Error(
      "useSelectedCard must be used within a SelectedCardProvider"
    );
  }
  return context;
};
