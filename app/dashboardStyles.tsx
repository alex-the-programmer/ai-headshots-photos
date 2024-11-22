import { View, FlatList, StyleSheet } from "react-native";
import { Style } from "./projectStack";
import StyleCard from "@/components/dashboard/styleCard";

const DashboardStyles = ({ navigation }) => {
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

export default DashboardStyles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
});
