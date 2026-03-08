import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { SharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FilterChipProps {
  icon: any;
  label: string;
  onPress: () => void;
  IconComponent?: any;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FilterChip = ({ icon, label, onPress, IconComponent = Feather }: FilterChipProps) => (
  <Pressable 
    onPress={onPress}
    style={({ pressed }) => [
      styles.chip,
      {
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        backgroundColor: pressed ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'
      }
    ]}
    className="flex-row items-center px-4 h-[36px] rounded-lg mr-2"
  >
    <IconComponent name={icon} size={16} color="rgba(255, 255, 255, 0.9)" />
    <Text style={styles.chipText}>{label}</Text>
  </Pressable>
);

interface SearchFiltersProps {
  onSelectCategory?: (category: string) => void;
  animatedPosition: SharedValue<number>;
}

export const SearchFilters = ({ onSelectCategory, animatedPosition }: SearchFiltersProps) => {
  const insets = useSafeAreaInsets();
  
  // The sheet is collapsed at SCREEN_HEIGHT - (insets.bottom + 80)
  // We want to fade in as it moves towards the medium snap point
  const animatedStyle = useAnimatedStyle(() => {
    const collapsedPos = SCREEN_HEIGHT - (insets.bottom + 80);
    
    // Using an increasing range [lower_bound, upper_bound]
    // where lower_bound is "open" (small Y) and upper_bound is "collapsed" (large Y)
    // We want opacity 1 when Y < collapsedPos - 100
    // We want opacity 0 when Y > collapsedPos - 20
    const opacity = interpolate(
      animatedPosition.value,
      [collapsedPos - 100, collapsedPos - 20],
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
        label="Gates" 
        onPress={() => onSelectCategory?.('gate')} 
      />
      <FilterChip 
        icon="map" 
        label="Grandstands" 
        onPress={() => onSelectCategory?.('grandstand')} 
      />
      <FilterChip 
        icon="coffee" 
        label="Food" 
        onPress={() => onSelectCategory?.('restaurant')} 
      />
      <FilterChip 
        icon="shopping-bag" 
        label="Merch" 
        onPress={() => onSelectCategory?.('shop')} 
      />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: -0.2,
  },
});
