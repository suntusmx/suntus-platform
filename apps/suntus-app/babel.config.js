module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            // AQUÍ ESTÁ LA MAGIA: Redirigimos la llamada vieja a la librería nueva
            "react-native-worklets/plugin": "react-native-worklets-core/plugin",
            "react-native-worklets": "react-native-worklets-core",
          },
        },
      ],
      // Reanimated siempre va al final
      "react-native-reanimated/plugin",
    ],
  };
};