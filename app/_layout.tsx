import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { useColorScheme } from "@/hooks/useColorScheme";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  FetchResult,
  Observable,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [client] = useState(() => {
    let apiUrl;
    const buildType =
      Constants.expoConfig?.extra?.eas?.buildType || "development";

    switch (buildType) {
      case "production":
        apiUrl = "https://apis.aiheadshotphotos.com/graphql";
        break;
      case "preview":
      case "development":
      // apiUrl = "https://ai-photo-gen-dev-b690bba115b5.herokuapp.com/graphql";
      // break;
      default:
        apiUrl = "http://localhost:3000/graphql";
    }
    const uploadLink = createUploadLink({
      uri: apiUrl,
      headers: {
        "Apollo-Require-Preflight": "true",
      },
      formDataAppendFile: (formData: FormData, name: string, file: any) => {
        // @ts-ignore
        formData.append(name, {
          uri: file.uri,
          type: file.type || "image/jpeg",
          name: file.name,
        });
      },
      includeExtensions: true,
      isExtractableFile: (value: any) => {
        return (
          value !== null &&
          typeof value === "object" &&
          "uri" in value &&
          "type" in value &&
          "name" in value
        );
      },
    });

    // Create a custom link that adds the session header
    const authLink = new ApolloLink((operation, forward) => {
      return new Observable<FetchResult>((observer) => {
        let handle: any;
        Promise.resolve(AsyncStorage.getItem("session"))
          .then((session) => {
            const sessionData = JSON.parse(session || "{}");
            console.log("before request", sessionData);
            operation.setContext({
              headers: {
                userSession: sessionData.jwtToken || "",
                platform: Platform.OS === "ios" ? "apple" : "google",
                accountId: sessionData.accountId || "",
              },
            });
          })
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      });
    });

    return new ApolloClient({
      link: authLink.concat(uploadLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "network-only",
        },
      },
    });
  });

  useEffect(() => {
    async function checkWelcomeStatus() {
      if (loaded) {
        // const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
        // if (!hasSeenWelcome) {
        router.replace("/welcome");
        // } else {
        // router.replace("/payment");
        // }
        SplashScreen.hideAsync();
      }
    }

    checkWelcomeStatus();
  }, [loaded, router]);

  if (!loaded) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="welcome" />
          {/* <Stack.Screen name="packageSelection" />
          <Stack.Screen name="imagesUpload" />
          <Stack.Screen name="projectStack" />
          <Stack.Screen name="(tabs)" /> */}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ApolloProvider>
  );
}
