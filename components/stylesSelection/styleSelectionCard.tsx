import React from "react";
import {
  PropertyStyleSelectionCardFragment,
  StyleStyleSelectionCardFragment,
} from "@/generated/graphql";
import IntoCard from "../common/intoCard";
import { View, Text, StyleSheet, Alert } from "react-native";
import { gql } from "@apollo/client";

const StyleSelectionCard = ({
  style,
  availableProperties,
  projectId,
  disabled,
  onSelect,
}: {
  style: StyleStyleSelectionCardFragment;
  availableProperties: PropertyStyleSelectionCardFragment[];
  projectId: string;
  disabled: boolean;
  onSelect: (styleId: string) => void;
}) => {
  const handleStylePress = () => {
    if (disabled) {
      maxStylesReachedAlert();
      return;
    }
    
    // Directly select the style without showing a modal
    onSelect(style.id);
  };

  const maxStylesReachedAlert = () => {
    Alert.alert(
      "You have reached the maximum number of styles that you paid for."
    );
  };

  return (
    <IntoCard
      onPress={handleStylePress}
      thumbnails={[style.logo]}
    >
      <Text style={styles.styleName}>{style.name}</Text>
    </IntoCard>
  );
};

export default StyleSelectionCard;

const styles = StyleSheet.create({
  styleName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});

export const FRAGMENT_STYLE_STYLE_SELECTION_CARD = gql`
  fragment styleStyleSelectionCard on Style {
    id
    name
    logo
  }
`;
