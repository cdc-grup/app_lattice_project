import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

interface SafeBlurViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * SafeBlurView now acts as a simple semi-transparent placeholder 
 * to avoid native 'Unimplemented component' errors while keeping the dark aesthetic.
 */
export const SafeBlurView = ({
  tint = 'dark',
  style,
  children
}: SafeBlurViewProps) => {
  // Use a solid semi-transparent fallback to mimic dark mode depth without native blur
  const fallbackColor = tint === 'dark' ? 'rgba(10, 10, 12, 0.85)' : 'rgba(255, 255, 255, 0.85)';

  return (
    <View style={[style, { backgroundColor: fallbackColor, overflow: 'hidden' }]}>
      {children}
    </View>
  );
};
