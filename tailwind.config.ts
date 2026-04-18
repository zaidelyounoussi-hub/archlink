import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F1E6D2",
        ink: "#210706",
        stone: "#7A6A6A",
        terracotta: "#891D1A",
        sage: "#5E657B",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;