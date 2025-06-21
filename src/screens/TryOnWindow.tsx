import React, { useState } from "react";
import { StyleSheet, Image, ScrollView, Dimensions, SafeAreaView, View, Modal, TouchableOpacity, Alert } from "react-native";
import { Appbar, Card, Text, Button, useTheme, IconButton } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useErrorContext } from "../contexts/ErrorContext";

type RootStackParamList = {
  TryOnWindow: { prediction: string };
};

type TryOnWindowRouteProp = RouteProp<RootStackParamList, 'TryOnWindow'>;
type TryOnWindowRouteProp = RouteProp<RootStackParamList, 'TryOnWindow'>;

export default function TryOnWindow() {
  const route = useRoute<TryOnWindowRouteProp>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { setError } = useErrorContext();
  const { prediction } = route.params;
  // const prediction = "https://img.freepik.com/free-psd/stylish-blue-plaid-shirt-men-isolated-transparent-background_191095-23034.jpg?semt=ais_hybrid"
  
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const downloadImage = async () => {
    try {
      setDownloading(true);
      
      // Get the file extension from the URL
      const extension = prediction.split('.').pop() || 'jpg';
      const fileName = `style_snap_${Date.now()}.${extension}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Download the file
      const downloadResult = await FileSystem.downloadAsync(
        prediction,
        fileUri
      );
      
      if (downloadResult.status === 200) {
        // Share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      } else {
        setError('Failed to download image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      setError('Failed to download image');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card} elevation={4}>
          <TouchableOpacity onPress={() => setImagePreviewVisible(true)}>
            <Card.Cover source={{ uri: prediction }} style={styles.image} />
          </TouchableOpacity>
          <Card.Content>
            <Text style={styles.caption} variant="titleMedium" >
              Your Style Snap!!!.
            </Text>
          </Card.Content>
        </Card>
        
        {/* Full Screen Image Preview Modal */}
        <Modal
          visible={imagePreviewVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImagePreviewVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setImagePreviewVisible(false)}
              >
                <IconButton icon="close" size={24} iconColor="white" />
              </TouchableOpacity>
            </View>
            
            {/* <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={downloadImage}
              disabled={downloading}
            >
              <View style={styles.downloadButtonContainer}>
                <IconButton 
                  icon={downloading ? "loading" : "share"} 
                  size={30} 
                  iconColor="white" 
                  animated={downloading}
                />
                <Text style={styles.downloadText}>Share</Text>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity 
              style={styles.fullScreenImageContainer}
              activeOpacity={1}
              onPress={() => setImagePreviewVisible(false)}
            >
              <Image 
                source={{ uri: prediction }} 
                style={styles.fullScreenImage} 
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Modal>

        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
          contentStyle={styles.buttonContent}
          uppercase={false}
        >
          Back
        </Button>
      </ScrollView>
    </SafeAreaView>
    </SafeAreaView>
  );
}

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    padding: 16,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  card: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    height: windowHeight * 0.5,
    resizeMode: "cover",
    resizeMode: "cover",
  },
  caption: {
    textAlign: "center",
    marginTop: 12,
    marginTop: 12,
  },
  button: {
    width: '60%',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  closeButton: {
    zIndex: 10,
  },
  downloadButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 30,
    padding: 10,
    zIndex: 10,
  },
  downloadButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadText: {
    color: 'white',
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
