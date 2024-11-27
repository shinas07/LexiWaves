const defaultTheme = require("tailwindcss/defaultTheme");
const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette");


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Combined file extensions from both configurations
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'muted-text': '#A8A29E',
        'muted-foreground': '#D6C9B6',
        'custom-gray': '#A8A29E',
        primary: colors.blue,        // Added primary color extension
        secondary: colors.indigo,    // Added secondary color extension
      },
      boxShadow: {
        input: '0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)',
      },
      fontFamily:{
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
        mono: ["Fira Code", ...defaultTheme.fontFamily.mono],
      lexiwaves: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    
    addVariablesForColors,          

    function({ addUtilities }) {
      addUtilities({
        // '.scrollbar': {
        //   '&::-webkit-scrollbar': {
        //     width: '4px',
        //   },
        //   '&::-webkit-scrollbar-track': {
        //     background: '#1F2937', // Dark background
        //     borderRadius: '100vh',
        //   },
        //   '&::-webkit-scrollbar-thumb': {
        //     background: '#374151', // Darker thumb
        //     borderRadius: '100vh',
        //     '&:hover': {
        //       background: '#4B5563' // Even darker on hover
        //     }
        //   }
        // },
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '2px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1F2937',
            borderRadius: '100vh',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#374151',
            borderRadius: '100vh',
            '&:hover': {
              background: '#4B5563'
            }
          }
        }
      })
    },
    function ({ matchUtilities, theme }) {
      matchUtilities({
        "bg-grid": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }),
        "bg-grid-small": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }),
        "bg-dot": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
          )}")`,
        }),
      }, { values: flattenColorPalette(theme("backgroundColor")), type: "color" });
    },
  ],
};

// Function to add CSS variables for colors
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
