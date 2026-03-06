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

const CustomBackground = ({ style, animatedIndex }: BottomSheetBackgroundProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Solid fallback color for when BlurView is missing/unimplemented
    const opacity = interpolate(
      animatedIndex.value,
      [-1, 0, 1],
      [0.4, 0.92, 1],
      Extrapolate.CLAMP
    );
    
    return {
      backgroundColor: `rgba(18, 18, 20, ${opacity})`,
    };
  });

  return (
    <Animated.View style={[style, styles.blurBackground, animatedStyle]}>
      <SafeBlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.premiumBorder} />
    </Animated.View>
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
  blurBackground: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  handleIndicator: {
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
    width: 36,
    height: 5,
    marginTop: 2,
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
    borderTopWidth: 0.5,
    borderLeftWidth: 0.2,
    borderRightWidth: 0.2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    pointerEvents: 'none',
  }
});

