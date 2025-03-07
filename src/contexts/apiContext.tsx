import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useErrorContext } from "./ErrorContext";

// Storage key for the API endpoint
const API_ENDPOINT_STORAGE_KEY = "app_api_endpoint";

// Default API endpoint to use if none is stored
const DEFAULT_API_ENDPOINT = "https://267a-110-38-229-3.ngrok-free.app";

export interface ApiContextType {
  endpoint: string;
  setEndpoint: (endpoint: string) => void;
  isLoading: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [endpoint, setEndpointState] = useState<string>(DEFAULT_API_ENDPOINT);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setError } = useErrorContext();

  // Load the stored endpoint when the component mounts
  useEffect(() => {
    const loadStoredEndpoint = async () => {
      try {
        setIsLoading(true);
        const storedEndpoint = await AsyncStorage.getItem(API_ENDPOINT_STORAGE_KEY);
        
        if (storedEndpoint) {
          setEndpointState(storedEndpoint);
        }
      } catch (error) {
        
        setError("Failed to load API settings. Using default API endpoint.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredEndpoint();
  }, [setError]);

  // Custom setter that updates both state and AsyncStorage
  const setEndpoint = async (newEndpoint: string) => {
    try {
      // Update state first for immediate UI response
      setEndpointState(newEndpoint);
      
      // Then persist to storage
      await AsyncStorage.setItem(API_ENDPOINT_STORAGE_KEY, newEndpoint);
    } catch (error) {
     
      setError("Failed to save API settings. Changes may not persist after restart.");
    }
  };

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
