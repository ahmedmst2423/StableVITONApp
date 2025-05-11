import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, Text, TouchableRipple, Surface, IconButton } from "react-native-paper";
import { Image, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useVtonImageContext } from "../contexts/VtonImageContext";
import { useErrorContext } from "../contexts/ErrorContext";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

export default function CameraWindow() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const { vtonImageUri, setVtonImageUri } = useVtonImageContext();
  const { setError } = useErrorContext();
  const navigation = useNavigation();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <Surface style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button mode="contained" onPress={requestPermission}>Grant Permission</Button>
      </Surface>
    );
  }

  const toggleCameraFacing = () => setFacing((c) => (c === "back" ? "front" : "back"));

  const takePicture = async () => {
    if (!cameraRef.current) return setError("Camera is not ready. Please try again.");
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (!photo?.uri) return;
      const newDir = FileSystem.documentDirectory + "images/";
      const dirInfo = await FileSystem.getInfoAsync(newDir);
      if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(newDir, { intermediates: true });
      const newPath = newDir + `${Date.now()}.jpg`;
      await FileSystem.moveAsync({ from: photo.uri, to: newPath });
      setVtonImageUri(newPath);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown camera error";
      setError(`Camera error: ${msg}`);
    }
  };

  return (
    <Surface style={styles.container}>
      {vtonImageUri ? (
        <>  
          <Image source={{ uri: vtonImageUri }} style={styles.preview}  />
          <View style={styles.actionButtonsContainer}>
            <IconButton
              icon="close"
              iconColor="#fff"
              size={30}
              mode="contained"
              containerColor="#f44336"
              onPress={() => setVtonImageUri(null)}
            />
            <IconButton
              icon="check"
              iconColor="#fff"
              size={30}
              mode="contained"
              containerColor="#4CAF50"
              onPress={() => navigation.goBack()}
            />
          </View>
        </>
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.viewfinder} />
          <View style={styles.buttonContainer}>
            <IconButton
              icon={() => <MaterialCommunityIcons name="camera-flip" size={28} color="#fff" />}
              onPress={toggleCameraFacing}
              style={styles.flipButton}
            />
            <TouchableRipple style={styles.captureButton} onPress={takePicture} rippleColor="rgba(0,0,0,0.1)">
              <View style={styles.captureInner} />
            </TouchableRipple>
          </View>
        </CameraView>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  message: { textAlign: 'center', paddingBottom: 10 },
  camera: { flex: 1, position: 'relative' },
  viewfinder: {
    // borderColor: 'rgba(255,255,255,0.6)',
    // borderWidth: 2,
    flex: 1,
    margin: 20,
    // borderRadius: 12,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    position: 'absolute',
    left: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
  },
  captureButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  preview: { width: '100%', height: '90%', borderRadius: 8, marginBottom: 10 },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 50,
    marginBottom: 20,
  },
});
