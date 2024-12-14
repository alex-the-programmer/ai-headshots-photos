import PackageCard from "@/components/packageSelection/packageCard";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { gql } from "@apollo/client";
import { usePackageSelectionPageQuery } from "@/generated/graphql";
import Loading from "@/components/common/loading";
import { useLocalSearchParams } from "expo-router";

const PackageSelectionScreen = () => {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const {
    data: packageList,
    loading: packageListLoading,
    error: packageListError,
  } = usePackageSelectionPageQuery();

  if (packageListLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require("../assets/images/packageSelection/hero.png")}
            style={styles.heroImage}
          />
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium Quality</Text>
          </View>
          <Text style={styles.heroTitle}>Choose a package</Text>
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
        <FlatList
          data={packageList?.availablePackages?.nodes}
          renderItem={({ item }) => (
            <PackageCard
              key={item.id}
              packageNode={item}
              projectId={projectId}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.plansContainer}
          contentContainerStyle={{ gap: 15 }}
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

const PACKAGE_SELECTION_PAGE_QUERY = gql`
  query PackageSelectionPage {
    availablePackages {
      nodes {
        ...PackageCard
      }
    }
  }
`;
