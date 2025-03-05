import React, { createContext, useContext, useState } from "react";

interface VtonImageContextType {
  vtonImageUri: string | null;
  setVtonImageUri: (uri: string | null) => void;
}

const VtonImageContext = createContext<VtonImageContextType | undefined>(undefined);

export const VtonImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vtonImageUri, setVtonImageUri] = useState<string | null>(null);

  return (
    <VtonImageContext.Provider value={{ vtonImageUri, setVtonImageUri }}>
      {children}
    </VtonImageContext.Provider>
  );
};

export const useVtonImageContext = () => {
  const context = useContext(VtonImageContext);
  if (!context) {
    throw new Error("useVtonImageContext must be used within a VtonImageProvider");
  }
  return context;
}; 