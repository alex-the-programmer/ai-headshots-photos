import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { gql } from "@apollo/client";
import SignInButton from "@/components/welcome/signInButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import Loading from "@/components/common/loading";

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);

  React.useEffect(() => {
    const checkSession = async () => {
      const sessionToken = await AsyncStorage.getItem("session");
      setHasSession(!!sessionToken);
    };

    checkSession();
  }, []);

  React.useEffect(() => {
    if (hasSession) {
      setIsLoading(false);
      router.replace("/packageSelection");
    }
    setIsLoading(false);
  }, [hasSession, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Grid of AI artwork examples */}
      <View style={styles.artworkGrid}>
        {/* You'll need to add your artwork images here */}
      </View>

      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Create your own masterpiece with AI</Text>
        <Text style={styles.subtitle}>
          Turn your ideas into AI powered artwork in seconds
        </Text>
      </View>

      {/* Start Creating Button */}
      <SignInButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  artworkGrid: {
    flex: 1,
    // Add grid layout styling for the artwork examples
  },
  textContainer: {
    marginVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
  },
});

const WELCOME_SCREEN_SIGN_IN_MUTATION = gql`
  mutation WelcomeScreenSignInWithExternalAccount(
    $input: SignInWithExternalAccountInput!
  ) {
    signInWithExternalAccount(input: $input) {
      clientMutationId
      userAuthentication {
        jwtToken
      }
    }
  }
`;
