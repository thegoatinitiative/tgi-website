import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00d4ff",
          50: "#e6fbff",
          100: "#ccf7ff",
          200: "#99efff",
          300: "#66e7ff",
          400: "#33dfff",
          500: "#00d4ff",
          600: "#00aacc",
          700: "#008099",
          800: "#005566",
          900: "#002b33",
        },
        accent: {
          DEFAULT: "#ff2a6d",
          50: "#ffe5ed",
          100: "#ffccdc",
          200: "#ff99b9",
          300: "#ff6696",
          400: "#ff3373",
          500: "#ff2a6d",
          600: "#cc2257",
          700: "#991941",
          800: "#66112c",
          900: "#330816",
        },
        success: {
          DEFAULT: "#00ff9f",
          50: "#e6fff5",
          100: "#ccffeb",
          200: "#99ffd6",
          300: "#66ffc2",
          400: "#33ffad",
          500: "#00ff9f",
          600: "#00cc7f",
          700: "#00995f",
          800: "#006640",
          900: "#003320",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          50: "#1a1a24",
          100: "#151519",
          200: "#111111",
          300: "#0d0d12",
          400: "#0a0a0f",
          500: "#080810",
          600: "#060608",
          700: "#040404",
          800: "#020202",
          900: "#000000",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-orbitron)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "dark-gradient": "linear-gradient(135deg, #0a0a0f 0%, #111111 100%)",
        "cyber-gradient": "linear-gradient(135deg, #00d4ff 0%, #ff2a6d 100%)",
        "hud-gradient": "linear-gradient(180deg, rgba(0, 212, 255, 0.1) 0%, rgba(10, 10, 15, 0.95) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff" },
          "100%": { boxShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
