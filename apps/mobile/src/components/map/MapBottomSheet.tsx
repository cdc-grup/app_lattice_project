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
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(28, 28, 30, ${interpolate(
        animatedIndex.value,
        [-1, 0, 1, 2],
        [0.4, 0.6, 0.75, 0.85],
        Extrapolate.CLAMP
      )})`,
    };
  });

  return (
    <Animated.View
      style={[
        style,
        styles.blurBackground,
        animatedStyle,
      ]}
    >
        <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
        />
    </Animated.View>
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
    paddingHorizontal: 16,
  },
});

