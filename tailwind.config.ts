import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Anuphan", "sans-serif"],
      },
      colors: {
        primary: {
          white: "#FFFFFF",
          "light-hover": "#DFDFE0",
          "light-active": "#BCBDBE",
          normal: "#272B2C",
          "normal-active": "#1F2224",
          black: "#000000",
        },
        functional: {
          neutral: "#DFDFE0",
          success: "#00D26A",
          error: "#F8312F",
        },
        logo: {
          pink: "#F5A2C9",
          orange: "#F5C689",
          blue: "#B6DBF5",
          violet: "#C59BD8",
        },
        gradients: {
          pink: "linear-gradient(to right, #F5A2C9, #FFC2D6)",
          orange: "linear-gradient(to right, #F5C689, #FFD8A9)",
          blue: "linear-gradient(to right, #B6DBF5, #D0F0FF)",
          violet: "linear-gradient(to right, #C59BD8, #E0B0FF)",
        },
      },
      
    },
  },
  plugins: [nextui()],
};
export default config;
