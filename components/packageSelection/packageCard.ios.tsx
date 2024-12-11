import { PackageCardFragment } from "@/generated/graphql";
import PackageCardInternal from "./packageCardInternal";

import Constants from "expo-constants";
import { errorCodes } from "@apollo/client/invariantErrorCodes";

const PackageCard = ({ packageNode }: { packageNode: PackageCardFragment }) => {
  const onPress = async () => {
    if (Constants.appOwnership === "expo") {
      return false; // todo handle expo fallback
    }
    const InAppPurchases = await import("expo-in-app-purchases");
    await InAppPurchases.connectAsync();
    await InAppPurchases.purchaseItemAsync(packageNode.appleProductId);

    return await new Promise((resolve, reject) => {
      InAppPurchases.setPurchaseListener(
        async ({ responseCode, results, errorCode }) => {
          switch (responseCode) {
            case InAppPurchases.IAPResponseCode.OK:
            case InAppPurchases.IAPResponseCode.DEFERRED:
              // todo call mutation to verify purchase
              await InAppPurchases.finishTransactionAsync(
                (results ?? [])[0],
                true
              );
              await InAppPurchases.disconnectAsync();
              return resolve(true);
            case InAppPurchases.IAPResponseCode.USER_CANCELED:
              return resolve(false);
            default:
              return reject(new Error("Purchase failed" + errorCode));
          }
        }
      );
    });
  };
  return <PackageCardInternal packageNode={packageNode} onPress={onPress} />;
};

export default PackageCard;
