export default ({ config }) => {
  return {
    ...config,
    extra: {
      eas: {
        buildType: process.env.EAS_BUILD_TYPE || "development",
      },
    },
  };
};
