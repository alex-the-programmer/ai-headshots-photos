import Card from "@/components/common/card";
import CircularAvatar from "@/components/common/circularAvatar";
import { createStackNavigator } from "@react-navigation/stack";

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { StyleCard } from "@/components/dashboard/styleCard";

// Type definitions
type Style = {
  id: string;
  name: string;
  outfit: string;
  outfitColor: string;
  images: string[];
  thumbnails: string[];
};

type RootStackParamList = {
  Styles: undefined;
  StyleImages: { style: Style };
};

const Stack = createStackNavigator<RootStackParamList>();

// Styles List Screen
const StylesScreen = ({ navigation }) => {
  // Mock data - replace with your actual data
  const stylesList: Style[] = [
    {
      id: "1",
      name: "Nature Background",
      outfit: "T-shirt and shorts",
      outfitColor: "Blue",
      images: [
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
      ],
      thumbnails: [
        "https://picsum.photos/50/50",
        "https://picsum.photos/50/50",
      ],
    },
    {
      id: "2",
      name: "Casual Summer",
      outfit: "T-shirt and shorts",
      outfitColor: "Blue",
      images: [
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
      ],
      thumbnails: [
        "https://picsum.photos/50/50",
        "https://picsum.photos/50/50",
      ],
    },
    {
      id: "3",
      name: "Beach",
      outfit: "T-shirt and shorts",
      outfitColor: "Blue",
      images: [
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
      ],
      thumbnails: [
        "https://picsum.photos/50/50",
        "https://picsum.photos/50/50",
      ],
    },
    {
      id: "4",
      name: "City",
      outfit: "T-shirt and shorts",
      outfitColor: "Blue",
      images: [
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
        "https://picsum.photos/500/500",
      ],
      thumbnails: [
        "https://picsum.photos/50/50",
        "https://picsum.photos/50/50",
      ],
    },
    // Add more styles...
  ];

  const renderStyleItem = ({ item }: { item: Style }) => (
    <StyleCard
      style={item}
      onPress={() => navigation.navigate("StyleImages", { style: item })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={stylesList}
        renderItem={renderStyleItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Style Images Screen
const StyleImagesScreen = ({ route }) => {
  const { style } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={style.images}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

// Main Navigator
export default function Dashboard() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#14142B",
        },
        headerTintColor: "#fff", // This colors the back button and title
        headerTitleStyle: {
          color: "#fff",
        },
      }}
    >
      <Stack.Screen
        name="Styles"
        component={StylesScreen}
        options={{ title: "My Styles" }}
      />
      <Stack.Screen
        name="StyleImages"
        component={StyleImagesScreen}
        options={({ route }) => ({
          title: route.params.style.name,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
  imageContainer: {
    flex: 1,
    padding: 8,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
});
