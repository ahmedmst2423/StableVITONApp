import React, { useState } from "react";
import { StyleSheet, ScrollView, Image, Dimensions, View } from "react-native";
import { Surface, Text, Button, TouchableRipple, Portal, Dialog, IconButton, ActivityIndicator } from "react-native-paper";
import ClothCard from "../components/ClothCard";
import { useVtonImageContext } from "../contexts/VtonImageContext";
import { useClothImageContext } from "../contexts/ClothImageContext";
import { useNavigation } from "@react-navigation/native";
import { useApiCall } from "../api/apiCall";
import { useImageUtilities } from "../utilities/imageUtilities";
import { useFileUtilities } from "../utilities/fileUtilities";
import { useErrorContext } from "../contexts/ErrorContext";

export default function Wardrobe() {
  const navigation = useNavigation<any>();
  const { vtonImageUri, setVtonImageUri } = useVtonImageContext();
  const { clothImageUri, setClothImageUri } = useClothImageContext();
  const { apiCall, isLoading: isApiLoading } = useApiCall();
  const { setError } = useErrorContext();
  const [selectedClothId, setSelectedClothId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {blobToBase64} = useImageUtilities();
  const {pickImage} = useFileUtilities();

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
      name: "Basic T-Shirt",
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
    {
      id: 11,
      image:
        "https://media.istockphoto.com/id/1618123205/photo/3d-rendering-of-a-black-t-shirt-isolated-on-a-white-background.jpg?s=2048x2048&w=is&k=20&c=EUuIEXH_5XAIPYDvssuGurhSjYLbmh07Yspdz24hubA=",
      name: "V-Neck T-Shirt",
      type: "Western",
      category: "Upper Body",
    },
  ];

  const handleSelectCloth = (id: number) => {
    setSelectedClothId(id);
    // Get the selected cloth's image URL
    const selectedCloth = cloths.find((cloth) => cloth.id === id);
    if (selectedCloth) {
      setClothImageUri(selectedCloth.image);
    }
  };

  const handlePredict = async () => {
    // Check if API is still initializing
    if (isApiLoading) {
      setError("API is still initializing. Please wait a moment and try again.");
      return;
    }
    
    // Check if both images are available
    if (!vtonImageUri) {
      setError("No person image captured. Please take or upload a picture first.");
      return;
    }
    
    if (!clothImageUri && !selectedClothId) {
      setError("No cloth selected. Please select a clothing item or take a picture of one.");
      return;
    }
    
    let clothImageToUse = clothImageUri;
    
    // If no direct cloth image is set but a cloth is selected from the list, use that
    if (!clothImageUri && selectedClothId) {
      const selectedCloth = cloths.find((cloth) => cloth.id === selectedClothId);
      if (!selectedCloth) {
        setError("Selected cloth not found. Please try selecting another item.");
        return;
      }
      clothImageToUse = selectedCloth.image;
    }
    
    setLoading(true);
    try {
      try {
        // Convert the local image to base64
        const localResponse = await fetch(vtonImageUri);
        const localBlob = await localResponse.blob();
        const localBase64 = await blobToBase64(localBlob);

        // Convert the remote cloth image to base64
        const remoteResponse = await fetch(clothImageToUse!);
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
         
          responseType: "blob",
        });

        // Convert the response blob to a base64 string
        const predictionBase64 = await blobToBase64(response.data);
        // Navigate to TryOnWindow with the prediction result
        navigation.navigate("TryOnWindow", { prediction: predictionBase64 });
      } catch (fetchError) {
        const errorMessage = fetchError instanceof Error 
          ? fetchError.message 
          : "Failed to process images. Please try again.";
        setError(`Image processing error: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An error occurred during prediction. Please try again.";
      setError(`Prediction failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePickerOption = async (option: 'camera' | 'upload') => {
    setModalVisible(false);

    if (option === 'camera') {
      navigation.navigate("CameraWindow");
    } else {
      try {
        const imageUri = await pickImage();
        if (imageUri) {
          setVtonImageUri(imageUri);
        } else {
          // pickImage already sets errors via the ErrorContext
        }
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An error occurred while picking an image";
        setError(errorMessage);
      }
    }
  };

  const handleClothImageUpload = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        setClothImageUri(imageUri);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An error occurred while picking an image";
      setError(errorMessage);
    }
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Section: Display VTON image & touchable area to open modal */}
        <Surface style={styles.topSection}>
          <Text style={styles.imageTitle}>Your Photo</Text>
          <TouchableRipple
            onPress={() => setModalVisible(true)}
            style={styles.imageContainer}
            rippleColor="rgba(0, 0, 0, .32)"
          >
            <>
              {vtonImageUri ? (
                <Image 
                  source={{ uri: vtonImageUri }} 
                  style={styles.takenImage} 
                  resizeMode="cover"
                />
              ) : (
                <Surface style={styles.placeholder}>
                  <Text>Tap to add your photo</Text>
                </Surface>
              )}
              <View style={styles.imageBadge}>
                <IconButton icon="camera-plus" size={24} />
              </View>
            </>
          </TouchableRipple>

          {/* Cloth Image Section */}
          <Text style={styles.imageTitle}>Clothing Photo</Text>
          <TouchableRipple
            onPress={handleClothImageUpload}
            style={styles.imageContainer}
            rippleColor="rgba(0, 0, 0, .32)"
          >
            <>
              {clothImageUri ? (
                <Image 
                  source={{ uri: clothImageUri }} 
                  style={styles.takenImage} 
                  resizeMode="cover"
                />
              ) : (
                <Surface style={styles.placeholder}>
                  <Text>Tap to upload clothing photo</Text>
                  <Text style={styles.smallText}>
                    Or select from wardrobe below
                  </Text>
                </Surface>
              )}
              <View style={styles.imageBadge}>
                <IconButton icon="file-upload" size={24} />
              </View>
            </>
          </TouchableRipple>
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
        </Surface>
        
        {/* Predict Button */}
        <Button
          mode="contained"
          onPress={handlePredict}
          loading={loading}
          style={styles.predictButton}
        >
          Predict
        </Button>
      </ScrollView>

      {/* Modal for Camera/Upload options */}
      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.dialog}>
          <Dialog.Title>Add Your Photo</Dialog.Title>
          <Dialog.Content>
            <Text>Choose an option to add your image</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button 
              mode="contained" 
              onPress={() => handleImagePickerOption('camera')}
              style={styles.dialogButton}
              icon="camera"
            >
              Camera
            </Button>
            <Button 
              mode="contained" 
              onPress={() => handleImagePickerOption('upload')}
              style={styles.dialogButton}
              icon="file-upload"
            >
              Upload
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
  );
}

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 24,
  },
  topSection: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  imageContainer: {
    width: "100%",
    height: windowHeight * 0.25,
    borderRadius: 8,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  takenImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  smallText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  imageBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    elevation: 3,
  },
  bottomSection: {
    padding: 12,
    marginBottom: 16,
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
    marginBottom: 24,
  },
  dialog: {
    borderRadius: 12,
  },
  dialogActions: {
    justifyContent: 'space-around',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  dialogButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
