import PrimaryButton from "@/components/common/primaryButton";
import PackageCard from "@/components/packageSelection/packageCard";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const PackageSelectionScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Image
            source={require("../assets/images/packageSelection/hero.png")}
            style={styles.heroImage}
          />
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium ⚡️</Text>
          </View>
          <Text style={styles.heroTitle}>Get the PRO version</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <TouchableOpacity style={styles.featureButton}>
            <Text style={styles.featureText}>AI Generation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton}>
            <Text style={styles.featureText}>🎬 Ad-Free Experience</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton}>
            <Text style={styles.featureText}>⚡️ Faster</Text>
          </TouchableOpacity>
        </View>

        {/* Plans Section */}
        <Text style={styles.planTitle}>Select a plan</Text>
        <View style={styles.plansContainer}>
          <PackageCard
            planType="Weekly"
            saveText="save 30%"
            price="$9.99/week"
          />

          <PackageCard
            planType="Monthly"
            saveText="save 80%"
            price="$19.99/month"
          />
        </View>

        {/* Subscribe Button */}
        <PrimaryButton
          text="Subscribe Now"
          onPress={() => {
            router.push("/imagesUpload");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  closeButtonText: {
    color: "white",
    fontSize: 24,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  premiumBadge: {
    backgroundColor: "#ffd700",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: -20,
  },
  premiumText: {
    color: "#000",
    fontWeight: "bold",
  },
  heroTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  featureButton: {
    backgroundColor: "#2a2a40",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  featureText: {
    color: "white",
    fontSize: 12,
  },
  planTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  plansContainer: {
    gap: 15,
  },
});

export default PackageSelectionScreen;
