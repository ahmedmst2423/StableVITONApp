import React from "react";
import { TextInput } from "react-native-paper";
import { useApiContext } from "../contexts/apiContext"

const WardrobeHeader: React.FC = () => {
  const { endpoint, setEndpoint } = useApiContext();

  return (
    <TextInput
      label="API Endpoint"
      value={endpoint}
      onChangeText={setEndpoint}
      style={{ flex: 1 }}
    />
  );
};

export default WardrobeHeader;
