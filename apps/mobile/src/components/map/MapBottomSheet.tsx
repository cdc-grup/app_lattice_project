import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import { theme } from '../../styles/theme';
import { colors } from '../../styles/colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapBottomSheetProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  translateY: SharedValue<number>;
  snapPoints: {
    collapsed: number;
    half: number;
    expanded: number;
  };
}

export const MapBottomSheet = ({ 
  children, 
  header, 
  translateY,
  snapPoints,
}: MapBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const context = useSharedValue({ y: 0 });

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 20, stiffness: 90 });
  }, [translateY]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      // Allow minor over-drag at top for rubber-banding effect (optional, keeping it simple for now)
      translateY.value = Math.max(translateY.value, snapPoints.expanded);
    })
    .onEnd((event) => {
      const { velocityY, translationY } = event;
      
      // If flicking fast, respect the direction
      if (Math.abs(velocityY) > 400) {
        if (velocityY > 0) { // Flick down
          scrollTo(translateY.value > snapPoints.half ? snapPoints.collapsed : snapPoints.half);
        } else { // Flick up
          scrollTo(translateY.value < snapPoints.half ? snapPoints.expanded : snapPoints.half);
        }
        return;
      }

      // If dragging slowly, snap to closest point with weighted bias
      const currentY = translateY.value;
      
      // Snapping logic: easier to escape extremes
      // If we've dragged 10% of the distance away from expanded, snap down.
      // If we've dragged 40% of the distance away from collapsed, snap up.
      const collThreshold = snapPoints.half * 0.4; 
      const halfExpandThreshold = snapPoints.expanded + (snapPoints.half - snapPoints.expanded) * 0.1;

      if (currentY > collThreshold) {
        scrollTo(snapPoints.collapsed);
      } else if (currentY > halfExpandThreshold) {
        scrollTo(snapPoints.half);
      } else {
        scrollTo(snapPoints.expanded);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [snapPoints.expanded + 50, snapPoints.expanded],
      [32, 0],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View 
        style={[
          styles.bottomSheetContainer, 
          { top: SCREEN_HEIGHT - insets.bottom }, 
          rBottomSheetStyle
        ]}
      >
        <View style={styles.line} />
        {header && <View style={styles.headerContainer}>{header}</View>}
        <ScrollView 
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEnabled={true}
        >
          {children}
          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#0F0F10', // Dark navbar color from theme
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    // Add shadow to separate from map
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  line: {
    width: 32,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 2,
  },
  headerContainer: {
    paddingHorizontal: 0,
    paddingBottom: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
