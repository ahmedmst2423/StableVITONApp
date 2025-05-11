import React from "react";
import { PaperProvider, MD3LightTheme as DefaultTheme } from "react-native-paper";
import StackNavigation from "./src/navigation/StackNavigation";
import Wardrobe from "./src/screens/Wardrobe";
import CameraWindow from "./src/screens/CameraWindow";
import { VtonImageProvider } from "./src/contexts/VtonImageContext";
import { ClothImageProvider } from "./src/contexts/ClothImageContext";
import { ApiProvider } from "./src/contexts/apiContext";
import { ErrorProvider } from "./src/contexts/ErrorContext";
import WardrobeHeader from "./src/components/WardrobeHeader";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import TryOnWindow from "./src/screens/TryOnWindow";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF9800",  // Eastern clothing
    secondary: "#03A9F4", // Western clothing
    tertiary: "#4CAF50",  // Upper Body
    error: "#E91E63",    // Lower Body
  },
};

const routes = {
  Wardrobe:Wardrobe,
  CameraWindow:CameraWindow,
  TryOnWindow:TryOnWindow
};

const headerOptions = {
  Wardrobe: {
    // Use the custom WardrobeHeader as the header title for the Wardrobe screen
    // headerRight: () => <WardrobeHeader />,
    headerTitle: "Wardrobe",
    headerTitleAlign: "left",
    // headerShown: false,
  },
  CameraWindow: {
    // Use the custom WardrobeHeader as the header title for the Wardrobe screen
    headerShown: false,
  },
  TryOnWindow: {
    // Use the custom WardrobeHeader as the header title for the Wardrobe screen
    headerShown: false,
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ErrorProvider>
        <ApiProvider>
          <VtonImageProvider>
            <ClothImageProvider>
              <StackNavigation routes={routes} headerOptions={headerOptions} />
            </ClothImageProvider>
          </VtonImageProvider>
        </ApiProvider>
      </ErrorProvider>
    </PaperProvider>
  );
}
