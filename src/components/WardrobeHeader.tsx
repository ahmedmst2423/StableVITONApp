import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, ActivityIndicator, Button, IconButton } from "react-native-paper";
import { useApiContext } from "../contexts/apiContext";
import { useErrorContext } from "../contexts/ErrorContext";

const WardrobeHeader: React.FC = () => {
  const { endpoint, setEndpoint, isLoading } = useApiContext();
  const { setError } = useErrorContext();
  const [editingEndpoint, setEditingEndpoint] = useState(endpoint);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveEndpoint = async () => {
    if (editingEndpoint && editingEndpoint !== endpoint) {
      // Basic validation for URL format
      if (!editingEndpoint.startsWith('http')) {
        setError("API endpoint must start with http:// or https://");
        return;
      }

      await setEndpoint(editingEndpoint);
      setIsEditing(false);
    } else {
      setIsEditing(false);
      setEditingEndpoint(endpoint); // Reset to original if unchanged
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingEndpoint(endpoint); // Reset to original
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            label="API Endpoint"
            value={editingEndpoint}
            onChangeText={setEditingEndpoint}
            style={styles.input}
            autoFocus
            right={
              <TextInput.Icon 
                icon="check" 
                onPress={handleSaveEndpoint} 
              />
            }
            left={
              <TextInput.Icon 
                icon="close" 
                onPress={handleCancelEdit} 
              />
            }
          />
        </>
      ) : (
        <IconButton
          icon="api"
          mode="contained"
          onPress={() => {
            setEditingEndpoint(endpoint);
            setIsEditing(true);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  loadingContainer: {
    padding: 8,
  },
  input: {
    flex: 1,
    height: 40,
  },
});

export default WardrobeHeader;
