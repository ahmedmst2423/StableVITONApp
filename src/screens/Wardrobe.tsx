import React, { useState } from "react";
import { StyleSheet, ScrollView, Image, Dimensions } from "react-native";
import { Surface, Text, Button, TouchableRipple } from "react-native-paper";
import ClothCard from "../components/ClothCard";
import { useImageContext } from "../contexts/ImageContext";
import { useNavigation } from "@react-navigation/native";
import { useApiCall } from "../api/apiCall";
import { useImageUtilities } from "../utilities/imageUtilities";

export default function Wardrobe() {
  const navigation = useNavigation<any>();
  const { imageUri } = useImageContext();
  const { apiCall } = useApiCall();
  const [selectedClothId, setSelectedClothId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const {blobToBase64} = useImageUtilities();

  // Sample cloth data
  const cloths = [
    {
      id: 1,
      image:
        "https://img.freepik.com/free-psd/stylish-blue-plaid-shirt-men-isolated-transparent-background_191095-23034.jpg?semt=ais_hybrid",
      name: "Casual Shirt",
      type: "Western",
      category: "Upper Body",
    },
    {
      id: 2,
      image:
        "https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_640.png",
      name: "T-Shirt",
      type: "Western",
      category: "Upper Body",
    },
    {
      id: 3,
      image:
        "https://t3.ftcdn.net/jpg/04/83/25/50/360_F_483255019_m1r1ujM8EOkr8PamCHF85tQ0rHG3Fiqz.jpg",
      name: "Jeans",
      type: "Western",
      category: "Lower Body",
    },
    // Add more cloth items as needed
  ];

  const handleSelectCloth = (id: number) => {
    setSelectedClothId(id);
  };

  // Helper function to convert Blob to base64 string
  

  const handlePredict = async () => {
    // Check if both images are available
    if (!imageUri) {
      console.error("No image captured from context");
      return;
    }
    if (!selectedClothId) {
      console.error("No cloth selected");
      return;
    }
    const selectedCloth = cloths.find((cloth) => cloth.id === selectedClothId);
    if (!selectedCloth) {
      console.error("Selected cloth not found");
      return;
    }
    setLoading(true);
    try {
      // Convert the local image to base64
      const localResponse = await fetch(imageUri);
      const localBlob = await localResponse.blob();
      const localBase64 = await blobToBase64(localBlob);

      // Convert the remote cloth image to base64
      const remoteResponse = await fetch(selectedCloth.image);
      const remoteBlob = await remoteResponse.blob();
      const remoteBase64 = await blobToBase64(remoteBlob);

      // Create a JSON payload with both base64 strings
      const payload = {
        image1: localBase64,
        image2: remoteBase64,
      };

      // Make a POST request to /predict with the JSON payload
      const response = await apiCall.post("/predict", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
        responseType: "blob",
      });

      // Convert the response blob to a base64 string
      const predictionBase64 = await blobToBase64(response.data);
      // Navigate to TryOnWindow with the prediction result
      navigation.navigate("TryOnWindow", { prediction: predictionBase64 });
    } catch (error) {
      console.error("Prediction API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Surface style={styles.container}>
      <ScrollView>
        {/* Top Section: Display taken picture & button to navigate to CameraWindow */}
        <Surface style={styles.topSection}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.takenImage} />
          ) : (
            <Surface style={styles.placeholder}>
              <Text>No image taken yet.</Text>
            </Surface>
          )}
          <Button
            mode="contained"
            onPress={() => navigation.navigate("CameraWindow")}
            style={styles.takePictureButton}
          >
            Take Picture
          </Button>
        </Surface>

        {/* Bottom Section: Horizontal ScrollView of ClothCards */}
        <Surface style={styles.bottomSection}>
          <Text style={styles.sectionTitle}>Your Wardrobe</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {cloths.map((cloth) => (
              <TouchableRipple
                key={cloth.id}
                onPress={() => handleSelectCloth(cloth.id)}
                rippleColor="rgba(0, 0, 0, .32)"
                style={[
                  styles.cardWrapper,
                  selectedClothId === cloth.id && styles.selectedCard,
                ]}
              >
                <ClothCard
                  image={cloth.image}
                  name={cloth.name}
                  type={cloth.type as "Eastern" | "Western"}
                  category={cloth.category as "Upper Body" | "Lower Body"}
                />
              </TouchableRipple>
            ))}
          </ScrollView>
          {/* Predict Button */}
        
        </Surface>
      </ScrollView>
      <Button
            mode="contained"
            onPress={handlePredict}
            loading={loading}
            style={styles.predictButton}
          >
            Predict
          </Button>
    </Surface>
  );
}

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  topSection: {
    height: windowHeight * 0.5,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  takenImage: {
    width: "100%",
    height: windowHeight * 0.35,
    borderRadius: 8,
    marginBottom: 12,
  },
  placeholder: {
    width: "100%",
    height: windowHeight * 0.35,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  takePictureButton: {
    marginTop: 8,
    width: "60%",
  },
  bottomSection: {
    height: windowHeight * 0.4,
    padding: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  cardWrapper: {
    marginHorizontal: 6,
    borderRadius: 8,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#FF9800", // Highlight color
    borderRadius: 8,
  },
  predictButton: {
    marginTop: 12,
    alignSelf: "center",
    width: "60%",
  },
});
