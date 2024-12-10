import { PackageCardFragment } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

const PackageCardInternal = ({
  packageNode,
  onPress,
}: {
  packageNode: PackageCardFragment;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.packageCard,
        packageNode.preselected ? styles.preselectedPlan : {},
      ]}
      onPress={onPress}
    >
      <View style={styles.packageHeader}>
        <Text style={styles.packageName}>{packageNode.name}</Text>
        {packageNode.badge ? (
          <View
            style={[
              styles.badge,
              // @ts-expect-errors
              { backgroundColor: packageNode.badgeColor.toLowerCase() },
            ]}
          >
            <Text style={styles.badgeText}>{packageNode.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.description}>
        {packageNode.headshotsCount} headshots with {packageNode.stylesCount}{" "}
        styles
      </Text>
      <Text style={styles.price}>${packageNode.price}</Text>
    </TouchableOpacity>
  );
};

export default PackageCardInternal;

const styles = StyleSheet.create({
  packageCard: {
    backgroundColor: "#2a2a40",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  packageName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },
  description: {
    color: "#888",
    fontSize: 14,
    marginTop: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  price: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preselectedPlan: {
    borderColor: "gold",
    borderWidth: 2,
  },
});

const PACKAGE_CARD_FRAGMENT = gql`
  fragment PackageCard on Package {
    id
    name
    price
    headshotsCount
    stylesCount
    badge
    badgeColor
    preselected
  }
`;
