import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

const PackageCard = ({
  planType,
  saveText,
  price,
}: {
  planType: string;
  saveText: string;
  price: string;
}) => {
  return (
    <TouchableOpacity style={styles.planCard}>
      <View style={styles.planHeader}>
        <Text style={styles.planType}>{planType}</Text>
        <View style={styles.saveBadge}>
          <Text style={styles.saveText}>{saveText}</Text>
        </View>
      </View>
      <Text style={styles.trialText}>7-day free trial</Text>
      <Text style={styles.price}>{price}</Text>
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
});
