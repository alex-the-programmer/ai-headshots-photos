import { Style } from "@/app/projectStack";
import IntoCard from "@/components/common/intoCard";
import { FlatList, Text, StyleSheet } from "react-native";
import StylesSelectionModal from "./stylesSelectionModal";
import { useState } from "react";

const stylesList = [
  {
    id: "1",
    name: "Style 1",
    logos: ["https://picsum.photos/150/150", "https://picsum.photos/150/150"],
  },
  {
    id: "2",
    name: "Style 2",
    logos: ["https://picsum.photos/150/150", "https://picsum.photos/150/150"],
  },
  {
    id: "3",
    name: "Style 3",
    logos: ["https://picsum.photos/150/150", "https://picsum.photos/150/150"],
  },
  {
    id: "4",
    name: "Style 4",
    logos: ["https://picsum.photos/150/150", "https://picsum.photos/150/150"],
  },
  {
    id: "5",
    name: "Style 5",
    logos: ["https://picsum.photos/150/150", "https://picsum.photos/150/150"],
  },
  {
    id: "6",
    name: "Style 6",
    logos: ["https://picsum.photos/150/150", "https://picsum.photos/150/150"],
  },
  {
    id: "7",
    name: "Style 7",
    logos: ["https://picsum.photos/150/150", "https://picsum.photos/150/150"],
  },
  {
    id: "8",
    name: "Style 8",
    logos: ["https://picsum.photos/150/150", "https://picsum.photos/150/150"],
  },
];

const StylesList = () => {
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStylePress = (style: Style) => {
    setSelectedStyle(style);
    setModalVisible(true);
  };

  return (
    <>
      <FlatList
        data={stylesList}
        renderItem={({ item }) => (
          <IntoCard
            onPress={() => handleStylePress(item)}
            thumbnails={item.logos}
          >
            <Text style={styles.whiteText}>{item.name}</Text>
          </IntoCard>
        )}
      />
      <StylesSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        style={selectedStyle}
      />
    </>
  );
};

export default StylesList;

const styles = StyleSheet.create({
  whiteText: {
    color: "white",
  },
});
