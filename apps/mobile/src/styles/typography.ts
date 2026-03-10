export const typography = {
  primary: {
    regular: 'Outfit-Regular',
    medium: 'Outfit-Medium',
    semibold: 'Outfit-SemiBold',
    bold: 'Outfit-Bold',
  },
  secondary: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    bold: 'PlusJakartaSans-Bold',
    extraBold: 'PlusJakartaSans-ExtraBold',
  },
} as const;

export const authStyles = {
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 20,
    lineHeight: 32,
  }
} as const;

export const pageStyles = {
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
  }
} as const;

export default typography;
