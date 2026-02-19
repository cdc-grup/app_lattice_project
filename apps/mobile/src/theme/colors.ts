export const colors = {
  text: {
    primary: '#FFFFFF',    // White
    secondary: '#9CA3AF',  // Gray 400
    muted: '#71717A',      // Zinc 500
    accent: '#FF382E',     // Red 500
    error: '#EF4444',      // Red 500 (Standard error)
    inverse: '#000000',    // Black
  },
  background: {
    primary: '#0F0F10',    // Stone 950
    secondary: '#181110',  // Neutral 900
    tertiary: '#281B1B',   // Stone 900
    surface: '#18181B',    // Zinc 900
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  primary: {
    DEFAULT: '#FF382E',
    light: '#FF5C54',
    dark: '#D12D25',
    glow: 'rgba(255, 56, 46, 0.4)',
  },
  border: {
    default: '#27272A',    // Zinc 800
    muted: '#334155',      // Slate 700
  },
  status: {
    success: '#4ADE80',
    warning: '#EAB308',
    error: '#FF382E',
  }
} as const;

export default colors;
