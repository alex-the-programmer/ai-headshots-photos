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
  createHttpLink,
  FetchResult,
  Observable,
} from "@apollo/client";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [client] = useState(() => {
    const httpLink = createHttpLink({
      uri: "http://localhost:3000/graphql",
    });

    // Create a custom link that adds the session header
    const authLink = new ApolloLink((operation, forward) => {
      return new Observable<FetchResult>((observer) => {
        let handle: any;
        Promise.resolve(AsyncStorage.getItem("session"))
          .then((session) => {
            operation.setContext({
              headers: {
                userSession: session || "",
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
      link: authLink.concat(httpLink),
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
          <Stack.Screen name="payment" />
          <Stack.Screen name="imagesUpload" />
          <Stack.Screen name="projectStack" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ApolloProvider>
  );
}
