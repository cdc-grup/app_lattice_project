import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import Animated, { SharedValue, useAnimatedProps, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface MapBottomSheetProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  translateY: SharedValue<number>;
  snapPoints?: any; // kept for backwards compat but ignored
}

const CustomBackground = ({ style, animatedIndex }: BottomSheetBackgroundProps) => {
  // We can animate the blur intensity based on the bottom sheet's position
  const animatedProps = useAnimatedProps(() => {
    return {
      intensity: interpolate(
        animatedIndex.value, // index goes from 0 (collapsed) to 2 (expanded)
        [0, 1, 2],
        [40, 60, 80], // Higher intensity as we open
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <AnimatedBlurView
      tint="dark"
      animatedProps={animatedProps}
      style={[
        style,
        styles.blurBackground,
      ]}
    />
  );
};

export const MapBottomSheet = forwardRef<BottomSheet, MapBottomSheetProps>(({ 
  children, 
  header, 
  translateY,
}, ref) => {
  const insets = useSafeAreaInsets();

  // Define actual heights or percentages from bottom instead of translated values pointing to top
  // You want to measure from bottom up. Example: search bar size, half size, full
  const snapPointsCalculated = useMemo(() => [
    insets.bottom + 85,          // Collapsed (1)
    insets.bottom + 220,         // Half (2)
    SCREEN_HEIGHT - insets.top   // Expanded (3)
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
      {header && <View style={styles.headerContainer}>{header}</View>}
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    // We add a subtle dark overlay on top of the blur just in case
    backgroundColor: 'rgba(20, 20, 25, 0.4)',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 40,
    marginTop: 6,
  },
  headerContainer: {
    paddingHorizontal: 0,
    paddingBottom: 2,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
});

