import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["EP Sans", ...defaultTheme.fontFamily.sans],
        "ep-sans": ["EP Sans", ...defaultTheme.fontFamily.sans],
        "ep-gothic": ["EP Gothic", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
