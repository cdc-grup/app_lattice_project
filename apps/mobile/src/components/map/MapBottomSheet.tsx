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
    <SafeBlurView 
      intensity={80} 
      tint="dark"
      style={[style, styles.blurBackground]}
    >
      <View style={styles.premiumBorder} />
    </SafeBlurView>
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
    insets.bottom + 84,          // Collapsed (search bar + gap)
    SCREEN_HEIGHT * 0.48,        // Medium/Expanded (The new focus state, restricted to Photo 1 height)
  ], [insets.bottom]);

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPointsCalculated}
      backgroundComponent={CustomBackground}
      handleIndicatorStyle={styles.handleIndicator}
      // Pass the animated position up to let the map sync with it
      animatedPosition={translateY}
      keyboardBehavior="extend"
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
    backgroundColor: 'rgba(10, 10, 12, 0.85)',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 40,
    height: 5,
    borderRadius: 2.5,
    marginTop: 10,
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

