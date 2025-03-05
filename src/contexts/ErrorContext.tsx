import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar } from "react-native-paper";
import { StyleSheet, View } from "react-native";

interface ErrorContextType {
  setError: (message: string) => void;
  clearError: () => void;
  error: string | null;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setErrorState] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const setError = useCallback((message: string) => {
    setErrorState(message);
    setVisible(true);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
    setVisible(false);
  }, []);

  const onDismissSnackBar = () => {
    clearError();
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
      <View style={styles.snackbarContainer}>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Dismiss",
            onPress: clearError,
          }}
          duration={3000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </View>
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  snackbar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
}); 