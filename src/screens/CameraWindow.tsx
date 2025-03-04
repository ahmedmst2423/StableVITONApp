import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, Text, TouchableRipple, Surface } from "react-native-paper";
import { Image, StyleSheet, View } from "react-native";
import { useImageContext } from "../contexts/ImageContext";
import * as FileSystem from "expo-file-system";

export default function CameraWindow() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const { imageUri, setImageUri } = useImageContext();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Surface style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </Surface>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) {
        // Define the destination directory (persistent storage)
        const newDir = FileSystem.documentDirectory + "images/";
        // Check if the directory exists; if not, create it.
        const dirInfo = await FileSystem.getInfoAsync(newDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(newDir, { intermediates: true });
        }
        // Create a unique file name using the current timestamp
        const newPath = newDir + new Date().getTime() + ".jpg";
        // Move the image file from its current (cache) location to the permanent directory
        await FileSystem.moveAsync({
          from: photo.uri,
          to: newPath,
        });
        // Save the new URI in your context
        setImageUri(newPath);
      }
    }
  };

  return (
    <Surface style={styles.container}>
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <Button mode="contained" onPress={() => setImageUri(null)}>
            Retake
          </Button>
        </>
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableRipple
              style={styles.button}
              onPress={toggleCameraFacing}
              rippleColor="rgba(255, 255, 255, 0.3)"
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableRipple>
            <TouchableRipple
              style={styles.captureButton}
              onPress={takePicture}
              rippleColor="rgba(0, 0, 0, 0.1)"
            >
              {/* A single View child is provided to satisfy React.Children.only */}
              <View style={{ flex: 1 }} />
            </TouchableRipple>
          </View>
        </CameraView>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    margin: 16,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    alignSelf: "center",
    marginBottom: 20,
  },
  preview: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 10,
  },
});
