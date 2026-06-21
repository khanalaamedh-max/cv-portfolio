import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 60px rgba(0, 0, 0, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
