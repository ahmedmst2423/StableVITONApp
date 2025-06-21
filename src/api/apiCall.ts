import axios, { AxiosInstance } from "axios";
import { useApiContext } from "../contexts/apiContext"; // adjust the path as needed
import { useErrorContext } from "../contexts/ErrorContext";
import { useState, useEffect } from "react";

export const useApiCall = (): { 
  apiCall: AxiosInstance; 
  secureAPI: AxiosInstance;
  isLoading: boolean;
} => {
  const { endpoint, isLoading: isApiContextLoading } = useApiContext();
  const { setError } = useErrorContext();
  const [apiInstances, setApiInstances] = useState<{
    apiCall: AxiosInstance;
    secureAPI: AxiosInstance;
  } | null>(null);

  // Create or update Axios instances when the endpoint changes
  useEffect(() => {
    if (!isApiContextLoading) {
      // Create Axios instances using the endpoint from context
      const apiCall = axios.create({
        baseURL: endpoint,
      });

      const secureAPI = axios.create({
        baseURL: endpoint,
      });

      // Add a response interceptor for error handling on the apiCall instance
      apiCall.interceptors.response.use(
        // Handle successful responses (status code in the 2xx range)
        (response) => response,
        // Handle errors (status code outside the 2xx range)
        async (error) => {
          console.log("API response error:", { error });

          let errorMessage = "";

          // Check if the error response data is a Blob (e.g., for file downloads)
          if (error.response?.data instanceof Blob) {
            try {
              const message = await error.response.data.text();
              const messageObj = JSON.parse(message);
              errorMessage = messageObj?.message || message;
            } catch (e) {
              errorMessage = "Failed to process error response from server";
            }
          } else {
            // Extract a message from the error response if available
            errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.Message || 
                          error.message || 
                          "An unknown error occurred";
          }

          // Set the error in our global context
          setError(`API Error: ${errorMessage}`);
          
          // Still reject the promise so component-level handlers can decide what to do
          return Promise.reject(errorMessage);
        }
      );

      // Add similar interceptor to secureAPI
      secureAPI.interceptors.response.use(
        (response) => response,
        async (error) => {
          console.log("Secure API response error:", { error });
          
          let errorMessage = "";
          
          if (error.response?.data instanceof Blob) {
            try {
              const message = await error.response.data.text();
              const messageObj = JSON.parse(message);
              errorMessage = messageObj?.message || message;
            } catch (e) {
              errorMessage = "Failed to process error response from server";
            }
          } else {
            errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.Message || 
                          error.message || 
                          "An unknown error occurred";
          }
          
          // Set the error in our global context
          setError(`Secure API Error: ${errorMessage}`);
          
          return Promise.reject(errorMessage);
        }
      );

      setApiInstances({ apiCall, secureAPI });
    }
  }, [endpoint, isApiContextLoading, setError]);

  // If API instances are not yet created or API context is loading, return dummy objects
  // that will be replaced when loading completes
  if (isApiContextLoading || !apiInstances) {
    // Return placeholder instances that will reject all requests while loading
    const dummyInstance = axios.create();
    dummyInstance.interceptors.request.use(
      () => Promise.reject(new Error("API is still initializing"))
    );
    
    return {
      apiCall: dummyInstance,
      secureAPI: dummyInstance,
      isLoading: true
    };
  }

  return {
    ...apiInstances,
    isLoading: false
  };
};

/* 
EXAMPLE CALL INSIDE A COMPONENT:

import React, { useEffect } from "react";
import { useApiCall } from "./useApiCall";

const ExampleComponent = () => {
  const { apiCall } = useApiCall();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiCall.get("client");
        console.log("Data:", response.data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    }
    fetchData();
  }, [apiCall]);

  return <div>Check console for output</div>;
};

export default ExampleComponent;
*/
