const colors = require("./src/styles/colors").colors;

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        background: colors.background,
        navbar: colors.navbar,
        border: colors.border,
        surface: colors.surface,
        muted: colors.muted,
        accent: colors.accent,
        glass: colors.glass,
        secondary: colors.secondary,
        steel: colors.steel,
        red: colors.red,
        slate: colors.slate,
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
        h2: ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        h3: ["1.25rem", { lineHeight: "1.75rem" }],
        body: ["1rem", { lineHeight: "1.5rem" }],
        small: ["0.875rem", { lineHeight: "1.25rem" }],
        tiny: ["0.75rem", { lineHeight: "1rem" }],
      },
      fontFamily: {
        sans: ["Outfit-Regular"],
        medium: ["Outfit-Medium"],
        semibold: ["Outfit-SemiBold"],
        bold: ["Outfit-Bold"],
        jakarta: ["PlusJakartaSans-Regular"],
        "jakarta-medium": ["PlusJakartaSans-Medium"],
        "jakarta-bold": ["PlusJakartaSans-Bold"],
        "jakarta-extra": ["PlusJakartaSans-ExtraBold"],
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [],
}