import { Image } from "react-native";

const CircularAvatar = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Image
      source={{ uri: imageUrl }}
      style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: "hidden",
      }}
    />
  );
};

export default CircularAvatar;
