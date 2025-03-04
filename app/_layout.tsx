import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

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
import {
  registerForPushNotificationsAsync,
  addNotificationListener,
  addNotificationResponseListener,
} from "@/src/services/notifications";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
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
        apiUrl = "https://ai-photo-gen-dev-b690bba115b5.herokuapp.com/graphql";
        break;
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
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token.data);
        // Here you would typically send this token to your backend
        // to associate it with the user
      }
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = addNotificationListener((notification) => {
      const data = notification.request.content.data;
      console.log("Received notification:", notification);

      // Handle invalid images notification
      if (data.type === "has_invalid_images" && data.project_id) {
        router.push({
          pathname: "/imagesUpload",
          params: { projectId: data.project_id },
        });
      }

      // Handle generated images notification
      if (data.type === "all_images_generated" && data.project_id) {
        router.push({
          pathname: "/projectStack",
          params: {
            projectId: data.project_id,
            screen: "Styles",
          },
        });
      }
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      console.log("Notification response:", data);

      // Handle the notification interaction here
      // For example, navigate to a specific screen based on the notification data
      if (data.screen) {
        router.push(data.screen as any); // Using type assertion since we trust the backend to send valid routes
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    async function checkWelcomeStatus() {
      if (loaded) {
        router.replace("/welcome");
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
