// /** @type {import('tailwindcss').Config} */

// // https://discourse.gohugo.io/t/tailwind-prose-markdown-code-samples-show-the-character/36106/4
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       typography: {
//         DEFAULT: {
//           css: {
//             "code::before": { content: "" },
//             "code::after": { content: "" },
//           },
//         },
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/typography")],
//   corePlugins: {
//     preflight: false,
//   },
// };

const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist: ["ProseMirror"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
