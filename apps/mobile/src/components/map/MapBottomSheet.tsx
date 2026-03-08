import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// SafeBlurView replaces the direct AnimatedBlurView usage

interface MapBottomSheetProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  translateY: SharedValue<number>;
  snapPoints?: any; // kept for backwards compat but ignored
}

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[style, styles.solidBackground]}>
      <View style={styles.premiumBorder} />
    </View>
  );
};

export const MapBottomSheet = forwardRef<BottomSheet, MapBottomSheetProps>(({ 
  children, 
  header, 
  translateY,
}, ref) => {
  const insets = useSafeAreaInsets();

  // Simplified snap points to match standard iOS maps behavior:
  // 1. Minimized (SearchBar visible)
  // 2. Medium (Half-ish screen)
  // 3. Full Screen
  const snapPointsCalculated = useMemo(() => [
    insets.bottom + 80,          // Collapsed (search bar only)
    SCREEN_HEIGHT * 0.45,        // Medium (standard list view)
    SCREEN_HEIGHT - insets.top   // Full
  ], [insets.bottom, insets.top]);

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPointsCalculated}
      backgroundComponent={CustomBackground}
      handleIndicatorStyle={styles.handleIndicator}
      // Pass the animated position up to let the map sync with it
      animatedPosition={translateY}
    >
      {header ? <View style={styles.headerContainer}>{header}</View> : null}
      <BottomSheetScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {children}
        <View style={{ height: 40 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  solidBackground: {
    backgroundColor: '#1C1C1E', // Match profile wizard background
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Matches w-12 h-1.5 bg-white/20
    width: 48,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  headerContainer: {
    paddingHorizontal: 0,
    paddingBottom: 2,
  },
  contentContainer: {
    paddingHorizontal: 0, // Content handles its own horizontal padding for better full-bleed support
  },
  premiumBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    pointerEvents: 'none',
  }
});

