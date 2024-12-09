import {
  ExternalAccountTypeEnum,
  useWelcomeScreenSignInWithExternalAccountMutation,
} from "@/generated/graphql";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignInButtonInternal from "./signInButtonInternal";
import { useRouter } from "expo-router";

const SignInButton = () => {
  const router = useRouter();
  const [signInWithExternalAccount] =
    useWelcomeScreenSignInWithExternalAccountMutation();
  const handlePress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      const data = await signInWithExternalAccount({
        variables: {
          input: {
            externalAccountId: credential.user,
            externalAccountType: ExternalAccountTypeEnum.Apple,
          },
        },
      });
      await AsyncStorage.setItem(
        "session",
        data.data?.signInWithExternalAccount?.userAuthentication?.jwtToken || ""
      );
      router.push("/payment");
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        console.log("User canceled Apple Sign in");
      } else {
        console.error("Apple Sign in error:", e);
      }
    }
  };
  return <SignInButtonInternal handlePress={handlePress} />;
};

export default SignInButton;
