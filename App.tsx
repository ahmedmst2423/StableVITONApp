import React from "react";
import { PaperProvider, MD3LightTheme as DefaultTheme } from "react-native-paper";
import StackNavigation from "./src/navigation/StackNavigation";
import Wardrobe from "./src/screens/Wardrobe";
import CameraWindow from "./src/screens/CameraWindow";
import { ImageProvider } from "./src/contexts/ImageContext";
import { ApiProvider } from "./src/contexts/apiContext";
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
  Wardrobe: Wardrobe,
  CameraWindow: CameraWindow,
  TryOnWindow:TryOnWindow
};

const headerOptions = {
  Wardrobe: {
    // Use the custom WardrobeHeader as the header title for the Wardrobe screen
    headerRight: () => <WardrobeHeader />,
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ApiProvider>
        <ImageProvider>
          <StackNavigation routes={routes} headerOptions={headerOptions} />
        </ImageProvider>
      </ApiProvider>
    </PaperProvider>
  );
}
