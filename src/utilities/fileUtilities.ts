import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { useErrorContext } from '../contexts/ErrorContext';

export const useFileUtilities = () => {
  const { setError } = useErrorContext();

  /**
   * Requests permission to access the device's photos
   * @returns Promise<boolean> - Whether permission was granted
   */
  const requestMediaLibraryPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access media library was denied');
        return false;
      }
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request media library permission';
      setError(errorMessage);
      return false;
    }
  };

  /**
   * Picks an image from the device's media library
   * @returns Promise<string | null> - The URI of the selected image or null
   */
  const pickImage = async (): Promise<string | null> => {
    // Check if permission is granted first
    try {
      const hasPermission = await requestMediaLibraryPermission();
      
      if (!hasPermission) {
        return null;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      // Get the selected asset
      const selectedAsset = result.assets[0];
      if (!selectedAsset || !selectedAsset.uri) {
        setError('No image was selected');
        return null;
      }

      // Define the destination directory (persistent storage)
      const newDir = FileSystem.documentDirectory + 'images/';
      
      // Check if the directory exists; if not, create it.
      try {
        const dirInfo = await FileSystem.getInfoAsync(newDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(newDir, { intermediates: true });
        }
        
        // Create a unique file name
        const filename = new Date().getTime() + '.jpg';
        const newPath = newDir + filename;
        
        // Copy the image to a permanent location
        await FileSystem.copyAsync({
          from: selectedAsset.uri,
          to: newPath,
        });
        
        return newPath;
      } catch (fileError) {
        const errorMessage = fileError instanceof Error ? fileError.message : 'Failed to save the selected image';
        setError(errorMessage);
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while picking an image';
      setError(errorMessage);
      return null;
    }
  };

  return {
    requestMediaLibraryPermission,
    pickImage,
  };
}; 