import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0B192C",      // Rich dark navy blue
          blue: "#1E3E62",      // Deep slate blue
          primary: "#164863",   // Primary brand blue
          light: "#F0F4F8",     // Clean background light gray-blue
          green: "#10B981",     // Emerald trust/verification green
          "green-hover": "#059669",
          accent: "#F59E0B",    // Amber/Gold accent for star ratings & badges
          danger: "#EF4444"     // Anti-scam report red
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(14, 30, 54, 0.12)',
        'card': '0 4px 20px -2px rgba(11, 25, 44, 0.06)',
        'elevated': '0 12px 30px -4px rgba(11, 25, 44, 0.14)'
      }
    },
  },
  plugins: [],
};
export default config;
