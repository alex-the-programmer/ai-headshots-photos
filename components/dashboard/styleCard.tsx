import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "@/components/common/card";
import CircularAvatar from "@/components/common/circularAvatar";
import IntoCard from "../common/intoCard";

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

const StyleCardText = ({ style }: { style: Style }) => (
  <>
    <Text style={[styles.styleName, styles.whiteText]}>{style.name}</Text>
    <Text style={styles.whiteText}>Outfit: {style.outfit}</Text>
    <Text style={styles.whiteText}>Color: {style.outfitColor}</Text>
  </>
);

export const StyleCard = ({ style, onPress }: StyleCardProps) => (
  <IntoCard onPress={onPress} thumbnails={style.thumbnails}>
    <StyleCardText style={style} />
  </IntoCard>
);

const styles = StyleSheet.create({
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
