import axios, { AxiosInstance } from "axios";
import { useApiContext } from "../contexts/apiContext"; // adjust the path as needed

export const useApiCall = (): { apiCall: AxiosInstance; secureAPI: AxiosInstance } => {
  const { endpoint } = useApiContext();

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
      console.log("secure api response error:", { error });

      // Check if the error response data is a Blob (e.g., for file downloads)
      if (error.response?.data instanceof Blob) {
        const message = await error.response.data.text();
        const messageObj = JSON.parse(message);
        if (messageObj) return Promise.reject(messageObj);
        else return Promise.reject(message);
      } else {
        // Extract a message from the error response if available
        const errorMessage =
          error?.response?.data?.Message ?? error.message ?? error;
        console.log({ errorMessage });
        return Promise.reject(errorMessage);
      }
    }
  );

  return { apiCall, secureAPI };
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
