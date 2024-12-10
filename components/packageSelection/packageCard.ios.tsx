import { PackageCardFragment } from "@/generated/graphql";
import PackageCardInternal from "./packageCardInternal";

const PackageCard = ({ packageNode }: { packageNode: PackageCardFragment }) => {
  const onPress = () => {
    console.log("onPress");
  };
  return <PackageCardInternal packageNode={packageNode} onPress={onPress} />;
};

export default PackageCard;
