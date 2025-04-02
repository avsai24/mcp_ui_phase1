/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              color: '#1a1a1a',
              h2: { fontSize: "1.5rem" },   // Tailor sizes
              h3: { fontSize: "1.25rem" },
              h4: { fontSize: "1.125rem" },
              h5: { fontSize: "1rem" },
              h6: { fontSize: "0.875rem" },
            },
          },
        },
      },
    },
    plugins: [require("@tailwindcss/typography")],
  };