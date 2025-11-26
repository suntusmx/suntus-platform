/** @type {import('tailwindcss').Config} */
// suntus-landing usa Tailwind v3 (homologado con el resto del monorepo)
// Extiende el preset de packages/ui para componentes compartidos
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // Extender preset de packages/ui para componentes compartidos
  presets: [
    require("@suntus/ui/tailwind-preset"),
  ],
  theme: {
    extend: {
      // Estilos específicos de suntus-landing pueden ir aquí
    },
  },
  plugins: [],
};

