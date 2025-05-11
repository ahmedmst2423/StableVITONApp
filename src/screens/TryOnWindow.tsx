import React from "react";
import { StyleSheet, Image, ScrollView, Dimensions, SafeAreaView, View } from "react-native";
import { Appbar, Card, Text, Button, useTheme } from "react-native-paper";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  TryOnWindow: { prediction: string };
};

type TryOnWindowRouteProp = RouteProp<RootStackParamList, 'TryOnWindow'>;

export default function TryOnWindow() {
  const route = useRoute<TryOnWindowRouteProp>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  // const { prediction } = route.params;
  const prediction = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>      
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Try-On Preview" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card} elevation={4}>
          <Card.Cover source={{ uri: prediction }} style={styles.image} />
          <Card.Content>
            <Text style={styles.caption} variant="titleMedium" >
              Your Style Snap!!!.
            </Text>
          </Card.Content>
        </Card>

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
  },
  card: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    height: windowHeight * 0.5,
    resizeMode: "cover",
  },
  caption: {
    textAlign: "center",
    marginTop: 12,
  },
  button: {
    width: '60%',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
