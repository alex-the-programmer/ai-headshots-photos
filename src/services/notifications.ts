import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";

// Configure notifications to show when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    // Check if we have permission, if not request it
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    // Get the token
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
  } else {
    console.log("Must use physical device for Push Notifications");
    return null;
  }

  // Required for Android
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export function addNotificationListener(
  callback: (notification: Notifications.Notification) => void
) {
  const subscription = Notifications.addNotificationReceivedListener(callback);
  return subscription;
}

export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  const subscription =
    Notifications.addNotificationResponseReceivedListener(callback);
  return subscription;
}

export async function getNotificationPermissionsStatus() {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}
