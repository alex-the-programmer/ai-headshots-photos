import { Pressable, Image, Text, StyleSheet } from "react-native";
import StylesPropertiesModal from "./stylesPropertiesModal";
import { gql } from "@apollo/client";
import { CartProjectStyleFragment } from "@/generated/graphql";
import { useState } from "react";

const SelectedStyleCard = ({
  projectStyle,
}: {
  projectStyle: CartProjectStyleFragment;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleStylePress = () => {
    setModalVisible(true);
  };
  return (
    <>
      <Pressable
        key={projectStyle.id}
        style={styles.styleItem}
        onPress={handleStylePress}
      >
        <Image
          source={{ uri: projectStyle.style.logo }}
          style={styles.avatar}
        />
        <Text style={styles.label}>{projectStyle.style.name}</Text>
      </Pressable>
      <StylesPropertiesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        projectStyle={projectStyle}
      />
    </>
  );
};

export default SelectedStyleCard;

const styles = StyleSheet.create({
  styleItem: {
    alignItems: "center",
    gap: 8,
    width: 100,
  },
  label: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    flexWrap: "wrap",
    width: "100%",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
});

export const FRAGMENT_CART_PROJECT_STYLE = gql`
  fragment cartProjectStyle on ProjectStyle {
    id
    style {
      ...styleStyleSelectionCard
    }
    projectStyleProperties {
      nodes {
        id
        property {
          id
          name
        }
        propertyValue {
          id
          name
        }
      }
    }
    numberOfPhotos
    price
  }
`;
