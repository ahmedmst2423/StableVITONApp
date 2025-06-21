import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useErrorContext } from "./ErrorContext";

// Storage key for the API endpoint
const API_ENDPOINT_STORAGE_KEY = "app_api_endpoint";

// Default API endpoint to use if none is stored
const DEFAULT_API_ENDPOINT = "https://59d4.110-38-229-3.ngrok-free.app";

export interface ApiContextType {
  endpoint: string;
  setEndpoint: (endpoint: string) => void;
  isLoading: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize the endpoint from an environment variable or a default value
  const [endpoint, setEndpoint] = useState<string>("https://cf2d-110-38-229-3.ngrok-free.app");

  return (
    <ApiContext.Provider value={{ endpoint, setEndpoint, isLoading }}>
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
