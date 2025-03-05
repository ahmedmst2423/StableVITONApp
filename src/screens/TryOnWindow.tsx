import React from "react";
import { StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import { Surface, Text, Button } from "react-native-paper";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  TryOnWindow: { prediction: string };
};

type TryOnWindowRouteProp = RouteProp<RootStackParamList, "TryOnWindow">;

export default function TryOnWindow() {
  const route = useRoute<TryOnWindowRouteProp>();
  const navigation = useNavigation();
  let { prediction } = route.params;

  // Ensure the prediction string is a valid data URI.
 
  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Try On Window
        </Text>
        <Image 
          source={{ uri: prediction }} 
          style={styles.image} 
          resizeMode="contain"
        />
        <Text variant="bodyMedium" style={styles.caption}>
          This is your predicted try-on image.
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Back
        </Button>
      </ScrollView>
    </Surface>
  );
}

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: windowHeight * 0.5,
    resizeMode: "contain",
    borderRadius: 8,
    marginBottom: 16,
  },
  caption: {
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    width: "60%",
  },
});
