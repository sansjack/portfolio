/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui"), require('tailwindcss-animated')],
  daisyui: {
    themes: [
      {
        dark: {
          // biome-ignore lint/complexity/useLiteralKeys: <explanation>
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#89B4FA"
        },
      },
    ],
  },

}

