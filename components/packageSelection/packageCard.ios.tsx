import {
  OrderProcessingStatusEnum,
  PackageCardFragment,
  useChoosePackageMutation,
  useVerifyApplePaymentMutation,
} from "@/generated/graphql";
import PackageCardInternal from "./packageCardInternal";

import Constants from "expo-constants";
import { gql } from "@apollo/client";
import { useRouter } from "expo-router";

const PackageCard = ({
  packageNode,
  projectId,
}: {
  packageNode: PackageCardFragment;
  projectId: string;
}) => {
  const router = useRouter();
  const [choosePackage] = useChoosePackageMutation();
  const [verifyApplePayment] = useVerifyApplePaymentMutation();
  const onPress = async () => {
    if (Constants.appOwnership === "expo") {
      const choosePackageResult = await choosePackage({
        variables: {
          projectId: projectId,
          packageId: packageNode.id,
        },
      });
      const verifyApplePaymentResult = await verifyApplePayment({
        variables: {
          orderId:
            choosePackageResult.data?.choosePackage?.project?.lastOrder?.id ??
            "",
        },
      });
      if (
        verifyApplePaymentResult.data?.verifyApplePayment?.order
          ?.processingStatus === OrderProcessingStatusEnum.PaymentProcessed
      ) {
        router.push({
          pathname: "/stylesSelection",
          params: {
            projectId: projectId,
          },
        });
      } else {
        console.log("payment not processed");
      }
      return;
    }
    const InAppPurchases = await import("expo-in-app-purchases");
    await InAppPurchases.connectAsync();
    InAppPurchases.purchaseItemAsync(packageNode.appleProductId);

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

export const CHOOSE_PACKAGE_MUTATION = gql`
  mutation ChoosePackage($projectId: ID!, $packageId: ID!) {
    choosePackage(input: { projectId: $projectId, packageId: $packageId }) {
      project {
        id
        lastOrder {
          id
          processingStatus
          package {
            id
          }
        }
      }
    }
  }
`;

export const MUTATION_VERIFY_APPLE_PAYMENT = gql`
  mutation VerifyApplePayment($orderId: ID!) {
    verifyApplePayment(input: { orderId: $orderId }) {
      order {
        id
        processingStatus
        package {
          id
        }
      }
    }
  }
`;
