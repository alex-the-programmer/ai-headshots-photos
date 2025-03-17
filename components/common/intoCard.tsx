import React from "react";
import { View, StyleSheet, Text } from "react-native";
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
        <View style={styles.thumbnailsContainer}>
          {thumbnails.map((thumbnail, index) => (
            <CircularAvatar key={index} imageUrl={thumbnail} />
          ))}
        </View>
        <View style={styles.textContainer}>{children}</View>
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  textContainer: {
    width: "100%",
    marginTop: 12,
    alignItems: "center",
  },
  thumbnailsContainer: {
    width: "100%",
  },
});
