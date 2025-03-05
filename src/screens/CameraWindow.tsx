import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, Text, TouchableRipple, Surface } from "react-native-paper";
import { Image, StyleSheet, View } from "react-native";
import { useVtonImageContext } from "../contexts/VtonImageContext";
import { useErrorContext } from "../contexts/ErrorContext";
import * as FileSystem from "expo-file-system";

export default function CameraWindow() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const { vtonImageUri, setVtonImageUri } = useVtonImageContext();
  const { setError } = useErrorContext();

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
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          try {
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
            setVtonImageUri(newPath);
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : "Failed to save photo";
            setError(`Camera error: ${errorMessage}`);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Failed to take photo";
        setError(`Camera error: ${errorMessage}`);
      }
    } else {
      setError("Camera is not ready. Please try again.");
    }
  };

  return (
    <Surface style={styles.container}>
      {vtonImageUri ? (
        <>
          <Image source={{ uri: vtonImageUri }} style={styles.preview} resizeMode="cover" />
          <Button mode="contained" onPress={() => setVtonImageUri(null)}>
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
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    width: "100%",
    padding: 20,
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  text: {
    color: "white",
  },
  captureButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    borderWidth: 5,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  preview: {
    width: "100%",
    height: "75%",
    borderRadius: 8,
    marginBottom: 20,
  },
});
