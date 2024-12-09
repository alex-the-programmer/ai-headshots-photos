import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com",
    // Optional: Add these if you want web/iOS support
    // iosClientId: "YOUR_IOS_CLIENT_ID",
    // webClientId: "YOUR_WEB_CLIENT_ID",
  });

  const handlePressIos = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      await AsyncStorage.setItem("session", credential.user);
      console.log("User token:", credential);
      router.push("/payment");
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        console.log("User canceled Apple Sign in");
      } else {
        console.error("Apple Sign in error:", e);
      }
    }
  };

  const handlePressAndroid = async () => {
    try {
      const result = await promptAsync();

      if (result?.type === "success" && result.authentication) {
        // Get user info using the access token
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: {
              Authorization: `Bearer ${result.authentication.accessToken}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log("Google user info:", userInfo);

        // Store user info in AsyncStorage
        await AsyncStorage.setItem(
          "session",
          JSON.stringify({
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            accessToken: result.authentication.accessToken,
          })
        );

        console.log("User info:", userInfo);
        router.push("/payment");
      } else {
        console.log("Google Sign in cancelled or failed");
      }
    } catch (e) {
      console.error("Google Sign in error:", e);
    }
  };

  const handlePress = async () => {
    if (Platform.OS === "ios") {
      handlePressIos();
    } else {
      handlePressAndroid();
    }
  };

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
      <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
        <Text style={styles.buttonText}>Start Creating ✨</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
