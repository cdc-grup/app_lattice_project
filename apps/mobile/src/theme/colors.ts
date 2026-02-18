export const colors = {
  text: {
    primary: '#FFFFFF',    // White
    secondary: '#9CA3AF',  // Gray 400 (titles/subtitles)
    tertiary: '#71717A',   // Zinc 500 (muted text)
    accent: '#FF382E',     // Red 500
    error: '#7F1D1D',      // Red 900
    inverse: '#000000',    // Black
  },
  background: {
    primary: '#0F0F10',    // Stone 950 (main bg)
    secondary: '#181110',  // Neutral 900
    tertiary: '#281B1B',   // Stone 900
    surface: '#18181B',    // Zinc 900
    card: '#27272A',       // Zinc 800
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  button: {
    primary: '#FF382E',    // Red 500
    primaryText: '#FFFFFF',
    secondary: '#1F2937',  // Gray 800
    secondaryText: '#FFFFFF',
    disabled: '#4B5563',   // Gray 600
  },
  border: {
    default: '#27272A',    // Zinc 800
    muted: '#334155',      // Slate 700
    accent: '#FF382E',     // Red 500
  },
  status: {
    success: '#4ADE80',    // Green 400
    warning: '#EAB308',    // Yellow 500
    error: '#FF382E',      // Red 500
  }
} as const;

export default colors;
