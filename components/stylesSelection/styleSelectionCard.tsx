import {
  PropertyStyleSelectionCardFragment,
  Style,
  StyleStyleSelectionCardFragment,
} from "@/generated/graphql";
import IntoCard from "../common/intoCard";
import { Text, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import StylesSelectionModal from "./stylesSelectionModal";
import { gql } from "@apollo/client";

const StyleSelectionCard = ({
  style,
  availableProperties,
  projectId,
  disabled,
}: {
  style: StyleStyleSelectionCardFragment;
  availableProperties: PropertyStyleSelectionCardFragment[];
  projectId: string;
  disabled: boolean;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleStylePress = () => {
    setModalVisible(true);
  };

  const maxStylesReachedAlert = () => {
    Alert.alert(
      "You have reached the maximum number of styles that you paid for."
    );
  };

  return (
    <>
      <IntoCard
        onPress={disabled ? maxStylesReachedAlert : handleStylePress}
        thumbnails={[style.logo]}
      >
        <Text style={styles.whiteText}>{style.name}</Text>
      </IntoCard>
      <StylesSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        style={style}
        properties={availableProperties}
        projectId={projectId}
      />
    </>
  );
};

export default StyleSelectionCard;
const styles = StyleSheet.create({
  whiteText: {
    color: "white",
  },
});

export const FRAGMENT_STYLE_STYLE_SELECTION_CARD = gql`
  fragment styleStyleSelectionCard on Style {
    id
    name
    logo
  }
`;
