/** @type {import('tailwindcss').Config} */
const withOpacity = (varName) => {
  return ({ opacityValue }) => {
    if (opacityValue) return `rgba(var(${varName}),${opacityValue})`;
    return `rgba(var(${varName}))`;
  };
};
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  plugins: [],
  theme: {
    extend: {
      animation: {
        wiggle: "wiggle 0.4s ease-in-out",
        scale: "scale 0.7s ease-in-out",
        fadein: "fadein 0.35s ease-in-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-9deg)" },
          "50%": { transform: "rotate(9deg)" },
        },
        fadein: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
        scale: {
          "0%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      colors: {
        primary: withOpacity("--color-palette-primary"),
        "light-primary": withOpacity("--color-palette-light-primary"),
        "light-secondary": withOpacity("--color-palette-light-secondary"),
        secondary: withOpacity("--color-palette-secondary"),
        danger: withOpacity("--color-palette-danger"),
        disable: withOpacity("--color-palette-disable"),
      },
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          like: withOpacity("--color-palette-primary"),
          dislike: withOpacity("--color-palette-danger"),
          "button-accent": withOpacity("--color-palette-primary"),
        },
      },
      backgroundColor: {
        skin: {
          main: withOpacity("--color-background-main"),
          secondary: withOpacity("--color-background-secondary"),
          "light-secondary": withOpacity("--color-background-light-secondary"),
        },
      },
      borderColor: {
        skin: {
          button: withOpacity("--color-palette-primary"),
        },
      },
      fontFamily: {
        sans: ["Virgil"],
      },
    },
  },
  variants: {
    extend: {},
  },
};
