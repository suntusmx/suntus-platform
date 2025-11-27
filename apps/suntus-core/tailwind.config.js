/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}" 
  ],
  presets: [require("nativewind/preset")],
  // OJO: Aquí falta el darkMode class para que lea el HTML
  darkMode: 'class', 
  theme: {
    extend: {
      // AQUÍ ESTÁ LA MAGIA QUE TE FALTA
      // Sin esto, Tailwind no sabe que 'primary' es una variable CSS
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};