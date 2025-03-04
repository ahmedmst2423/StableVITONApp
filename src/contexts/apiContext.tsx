import React, { createContext, useContext, useState } from "react";

export interface ApiContextType {
  endpoint: string;
  setEndpoint: (endpoint: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize the endpoint from an environment variable or a default value
  const [endpoint, setEndpoint] = useState<string>(process.env.REACT_APP_BASE_API || "http://192.168.18.62:5000");

  return (
    <ApiContext.Provider value={{ endpoint, setEndpoint }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
};
