/** @type {import('tailwindcss').Config} */
module.exports = {
    // 1. CONTENT: Dónde buscar clases.
    // Si no pones la ruta de "../../packages/ui", el botón compartido sale transparente.
    content: [
      "./app/**/*.{js,jsx,ts,tsx}", 
      "../../packages/ui/src/**/*.{js,jsx,ts,tsx}" 
    ],
    // 2. PRESETS: ¡OBLIGATORIO para NativeWind v4!
    // Sin esto, no compila a estilos nativos.
    presets: [require("nativewind/preset")],
    // 3. DARK MODE: Habilitar cambio manual del tema
    darkMode: 'class',
    theme: {
      extend: {},
    },
    plugins: [],
  };