import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: ["dark", "cupcake", "light"],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
} satisfies Config;
