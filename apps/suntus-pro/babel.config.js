module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Quitamos el alias manual de worklets porque ya lo hicimos físico con pnpm
      "react-native-reanimated/plugin", 
    ],
  };
};