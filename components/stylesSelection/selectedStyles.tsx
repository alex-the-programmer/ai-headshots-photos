import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";

interface SelectedStylesProps {
  selectedStyles: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
}

const selectedStyles = [
  {
    id: "1",
    name: "City daylight background, green sweater",
    imageUrl: "https://picsum.photos/150/150",
  },
  {
    id: "2",
    name: "City sunset background, blue suit",
    imageUrl: "https://picsum.photos/150/150",
  },
  { id: "3", name: "Style 3", imageUrl: "https://picsum.photos/150/150" },
  { id: "4", name: "Style 4", imageUrl: "https://picsum.photos/150/150" },
  { id: "5", name: "Style 5", imageUrl: "https://picsum.photos/150/150" },
  { id: "6", name: "Style 6", imageUrl: "https://picsum.photos/150/150" },
];

const SelectedStyles = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {selectedStyles.map((style) => (
        <View key={style.id} style={styles.styleItem}>
          <Image source={{ uri: style.imageUrl }} style={styles.avatar} />
          <Text style={styles.label}>{style.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  styleItem: {
    alignItems: "center",
    gap: 8,
    width: 100,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    flexWrap: "wrap",
    width: "100%",
  },
});

export default SelectedStyles;
