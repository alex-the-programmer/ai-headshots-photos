import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DashboardStylesFragment, ImageCardFragment } from "@/generated/graphql";
import ImageCard from "@/components/dashboard/imageCard";
import { useEffect, useState } from "react";

type RootStackParamList = {
  StyleImages: {
    style: DashboardStylesFragment;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, "StyleImages">;

const StyleImagesScreen = ({ route }: Props) => {
  const { style } = route.params;
  const [allImages, setAllImages] = useState<ImageCardFragment[]>([]);
  
  useEffect(() => {
    console.log("StyleImagesScreen - Style ID:", style.id);
    console.log("StyleImagesScreen - Style Name:", style.nameWithProperties);
    console.log("StyleImagesScreen - Images count:", style.generatedImages?.nodes?.length || 0);
    
    // Set all images
    if (style.generatedImages?.nodes) {
      setAllImages(style.generatedImages.nodes);
    }
    
    // Log the first few image URLs for debugging
    if (style.generatedImages?.nodes && style.generatedImages.nodes.length > 0) {
      console.log("First image thumbnail URL:", style.generatedImages.nodes[0].thumbnailUrl);
      console.log("First image original URL:", style.generatedImages.nodes[0].originalUrl);
    } else {
      console.warn("No images found for this style");
    }
  }, [style]);

  if (!style.generatedImages?.nodes || style.generatedImages.nodes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noImagesText}>No images available for this style.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allImages}
        renderItem={({ item, index }) => (
          <ImageCard 
            image={item} 
            images={allImages}
            initialIndex={index}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={() => (
          <Text style={styles.noImagesText}>No images available for this style.</Text>
        )}
      />
    </View>
  );
};

export default StyleImagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  noImagesText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  }
});
