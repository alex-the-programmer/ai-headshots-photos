import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import StylesPropertiesModal from "./stylesPropertiesModal";
import { useState } from "react";

interface SelectedStylesProps {
  selectedStyles: Array<{
    id: string;
    name: string;
    imageUrl: string;
    outfit?: string;
    outfitColor?: string;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<
    (typeof selectedStyles)[0] | null
  >(null);

  const handleStylePress = (style: (typeof selectedStyles)[0]) => {
    setSelectedStyle(style);
    setModalVisible(true);
  };
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {selectedStyles.map((style) => (
          <Pressable
            key={style.id}
            style={styles.styleItem}
            onPress={() => handleStylePress(style)}
          >
            <Image source={{ uri: style.imageUrl }} style={styles.avatar} />
            <Text style={styles.label}>{style.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <StylesPropertiesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        style={selectedStyle}
        onDelete={(styleId) => {
          // Handle delete logic here
          setModalVisible(false);
        }}
      />
    </>
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
