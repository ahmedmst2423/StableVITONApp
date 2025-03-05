import React, { createContext, useContext, useState } from "react";

interface ClothImageContextType {
  clothImageUri: string | null;
  setClothImageUri: (uri: string | null) => void;
}

const ClothImageContext = createContext<ClothImageContextType | undefined>(undefined);

export const ClothImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clothImageUri, setClothImageUri] = useState<string | null>(null);

  return (
    <ClothImageContext.Provider value={{ clothImageUri, setClothImageUri }}>
      {children}
    </ClothImageContext.Provider>
  );
};

export const useClothImageContext = () => {
  const context = useContext(ClothImageContext);
  if (!context) {
    throw new Error("useClothImageContext must be used within a ClothImageProvider");
  }
  return context;
}; 