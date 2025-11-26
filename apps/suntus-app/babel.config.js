module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // react-native-worklets-core/plugin debe ir antes de reanimated
      'react-native-worklets-core/plugin',
      // react-native-reanimated/plugin debe ser el último plugin
      'react-native-reanimated/plugin',
    ],
  };
};