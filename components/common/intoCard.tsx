import React from "react";
import { View, StyleSheet } from "react-native";
import Card from "./card";
import CircularAvatar from "./circularAvatar";

const IntoCard = ({
  onPress,
  children,
  thumbnails,
  disabled,
}: {
  onPress: () => void;
  children: React.ReactNode;
  thumbnails: string[];
  disabled?: boolean;
}) => {
  return (
    <Card onPress={onPress} style={styles.cardMargin} disabled={disabled}>
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>{children}</View>
        <View style={styles.thumbnailsContainer}>
          {thumbnails.map((thumbnail, index) => (
            <CircularAvatar key={index} imageUrl={thumbnail} />
          ))}
        </View>
      </View>
    </Card>
  );
};

export default IntoCard;

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
});
