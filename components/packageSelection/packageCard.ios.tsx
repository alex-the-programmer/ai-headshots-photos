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
import Purchases from "react-native-purchases";
import { useEffect } from "react";

const PackageCard = ({
  packageNode,
  projectId,
}: {
  packageNode: PackageCardFragment;
  projectId: string;
}) => {
  const APPLE_API_KEY = "appl_hMinwDlbtbTEqXXBeDyomsQqJdr";
  const router = useRouter();
  const [choosePackage] = useChoosePackageMutation();
  const [verifyApplePayment] = useVerifyApplePaymentMutation();

  const onPress = async () => {
    if (Constants.appOwnership !== "expo") {
      console.log("PackageCard: App ownership is not Expo, setting debug logs");
      Purchases.setDebugLogsEnabled(true);
      console.log("PackageCard: Getting offerings");
      const offerings = await Purchases.getOfferings();
      console.log("PackageCard: Offerings", offerings);

      const packageToBuy = offerings.current?.availablePackages.find(
        (p) => p.identifier === packageNode.appleProductId
      );
      console.log("PackageCard: Package to buy", packageToBuy);

      if (!packageToBuy) {
        console.log("PackageCard: No package to buy");
        return;
      }

      const choosePackageResult = await choosePackage({
        variables: {
          projectId: projectId,
          packageId: packageNode.id,
        },
      });

      console.log("PackageCard: Verifying Apple payment");
      const verifyApplePaymentResult = await verifyApplePayment({
        variables: {
          orderId:
            choosePackageResult.data?.choosePackage?.project?.lastOrder?.id ??
            "",
        },
      });

      console.log(
        "PackageCard: Verify Apple payment result",
        verifyApplePaymentResult
      );

      console.log("PackageCard: Purchasing package");
      const result = await Purchases.purchasePackage(packageToBuy);
      console.log("PackageCard: Purchase result", result);
    } else {
      console.log("PackageCard: App ownership is Expo, choosing package");
      const choosePackageResult = await choosePackage({
        variables: {
          projectId: projectId,
          packageId: packageNode.id,
        },
      });

      console.log("PackageCard: Verifying Apple payment");
      const verifyApplePaymentResult = await verifyApplePayment({
        variables: {
          orderId:
            choosePackageResult.data?.choosePackage?.project?.lastOrder?.id ??
            "",
        },
      });

      console.log(
        "PackageCard: Verify Apple payment result",
        verifyApplePaymentResult
      );
    }
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
