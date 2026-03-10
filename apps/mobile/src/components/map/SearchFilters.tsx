import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { SharedValue, useAnimatedStyle, interpolate, Extrapolate, withSpring, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';
import * as Haptics from 'expo-haptics';
import { SafeBlurView } from '../ui/SafeBlurView';

interface FilterChipProps {
  icon: any;
  label: string;
  onPress: () => void;
  IconComponent?: any;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FilterChip = ({ icon, label, onPress, IconComponent = Feather }: FilterChipProps) => {
  const scale = useSharedValue(1);

  const animatedInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Pressable 
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => (scale.value = withSpring(0.96))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: pressed ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
        }
      ]}
    >
      <Animated.View style={[styles.chipInner, animatedInnerStyle]}>
        <Feather name={icon as any} size={15} color="white" />
        <Text style={styles.chipText}>{label}</Text>
        <Feather name="chevron-down" size={12} color="rgba(255, 255, 255, 0.4)" style={{ marginLeft: 2 }} />
      </Animated.View>
    </Pressable>
  );
};

interface SearchFiltersProps {
  onSelectCategory?: (category: string) => void;
  animatedPosition: SharedValue<number>;
}

export const SearchFilters = ({ onSelectCategory, animatedPosition }: SearchFiltersProps) => {
  const insets = useSafeAreaInsets();
  
  // The sheet is collapsed at SCREEN_HEIGHT - (insets.bottom + 80)
  // We want to fade in as it moves towards the medium snap point
  const animatedStyle = useAnimatedStyle(() => {
    const collapsedPos = SCREEN_HEIGHT - (insets.bottom + 84);
    
    // Fade in quickly as the sheet moves from collapsed
    // Full opacity when moved only 50 pixels
    const opacity = interpolate(
      animatedPosition.value,
      [collapsedPos - 50, collapsedPos - 5],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
        className="mb-4"
      >
      <FilterChip 
        icon="log-in" 
        label="Accesos" 
        onPress={() => onSelectCategory?.('gate')} 
      />
      <FilterChip 
        icon="map" 
        label="Tribunas" 
        onPress={() => onSelectCategory?.('grandstand')} 
      />
      <FilterChip 
        icon="coffee" 
        label="Comida" 
        onPress={() => onSelectCategory?.('restaurant')} 
      />
      <FilterChip 
        icon="shopping-bag" 
        label="Tiendas" 
        onPress={() => onSelectCategory?.('shop')} 
      />
      <FilterChip 
        icon="plus-circle" 
        label="Servicios" 
        onPress={() => onSelectCategory?.('medical')} 
      />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 18,
    marginRight: 4,
    justifyContent: 'center',
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    color: 'white',
    fontSize: 14,
    fontFamily: typography.primary.bold,
    marginLeft: 6,
  },
});
