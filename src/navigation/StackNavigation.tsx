import React from "react";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = Record<string, undefined>;

const Stack = createStackNavigator<RootStackParamList>();

interface StackNavigationProps {
  routes: Record<string, React.ComponentType<any>>;
  // Global header screen options for all screens
  globalScreenOptions?: StackNavigationOptions;
  // Per-screen header options mapping by route name
  headerOptions?: Record<string, StackNavigationOptions>;
}

const StackNavigation: React.FC<StackNavigationProps> = ({ routes, globalScreenOptions, headerOptions }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        {Object.entries(routes).map(([name, Component]) => (
          <Stack.Screen
            key={name}
            name={name}
            component={Component}
            options={headerOptions?.[name] || {}}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
