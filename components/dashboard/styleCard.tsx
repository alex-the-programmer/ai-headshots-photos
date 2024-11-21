import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "@/components/common/card";
import CircularAvatar from "@/components/common/circularAvatar";

type Style = {
  id: string;
  name: string;
  outfit: string;
  outfitColor: string;
  images: string[];
  thumbnails: string[];
};

type StyleCardProps = {
  style: Style;
  onPress: () => void;
};

export const StyleCard = ({ style, onPress }: StyleCardProps) => (
  <Card onPress={onPress} style={styles.cardMargin}>
    <View style={styles.cardContent}>
      <View style={styles.textContainer}>
        <Text style={[styles.styleName, styles.whiteText]}>{style.name}</Text>
        <Text style={styles.whiteText}>Outfit: {style.outfit}</Text>
        <Text style={styles.whiteText}>Color: {style.outfitColor}</Text>
      </View>
      <View style={styles.thumbnailsContainer}>
        {style.thumbnails.map((thumbnail, index) => (
          <CircularAvatar key={index} imageUrl={thumbnail} />
        ))}
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  cardMargin: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  thumbnailsContainer: {
    flexDirection: "row",
    marginLeft: 16,
    gap: 8,
  },
  styleName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  whiteText: {
    color: "white",
  },
});

export default StyleCard;
