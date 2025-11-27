module.exports = {
  presets: [
    "next/babel",      // Necesario para que Next.js funcione
    "nativewind/babel", // La magia que te faltaba
    "@babel/preset-flow" // Soporte para sintaxis Flow (necesario para react-native)
  ],
};