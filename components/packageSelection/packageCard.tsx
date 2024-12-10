import { PackageCardFragment } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

const PackageCard = ({ packageNode }: { packageNode: PackageCardFragment }) => {
  return (
    <TouchableOpacity
      style={[
        styles.planCard,
        packageNode.preselected ? styles.preselectedPlan : {},
      ]}
    >
      <View style={styles.planHeader}>
        <Text style={styles.planType}>{packageNode.name}</Text>
        {packageNode.badge ? (
          <View
            style={[
              styles.saveBadge,
              // @ts-expect-errors
              { backgroundColor: packageNode.badgeColor.toLowerCase() },
            ]}
          >
            <Text style={styles.saveText}>{packageNode.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.trialText}>
        {packageNode.headshotsCount} headshots with {packageNode.stylesCount}{" "}
        styles
      </Text>
      <Text style={styles.price}>${packageNode.price}</Text>
    </TouchableOpacity>
  );
};

export default PackageCard;

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: "#2a2a40",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  planType: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveBadge: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },
  trialText: {
    color: "#888",
    fontSize: 14,
    marginTop: 5,
  },
  saveText: {
    color: "white",
    fontSize: 12,
  },
  price: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  planHeader: {
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
