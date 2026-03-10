import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native';
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
  isActive: boolean;
  onPress: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FilterChip = ({ icon, label, isActive, onPress }: FilterChipProps) => {
  const scale = useSharedValue(1);

  const animatedInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={styles.chipWrapper}>
      <Pressable 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <Animated.View style={[
          styles.chipInner, 
          isActive && styles.chipActive,
          animatedInnerStyle
        ]}>
          <Feather name={icon as any} size={15} color={isActive ? "white" : "rgba(255, 255, 255, 0.7)"} />
          <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

interface SearchFiltersProps {
  activeCategory: string | null;
  onSelectCategory?: (category: string) => void;
  animatedPosition: SharedValue<number>;
}

export const SearchFilters = ({ activeCategory, onSelectCategory, animatedPosition }: SearchFiltersProps) => {
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
      >
      <FilterChip 
        icon="log-in" 
        label="Acceso" 
        isActive={activeCategory === 'gate'}
        onPress={() => onSelectCategory?.('gate')} 
      />
      <FilterChip 
        icon="map" 
        label="Tribuna" 
        isActive={activeCategory === 'grandstand'}
        onPress={() => onSelectCategory?.('grandstand')} 
      />
      <FilterChip 
        icon="coffee" 
        label="Comida" 
        isActive={activeCategory === 'restaurant'}
        onPress={() => onSelectCategory?.('restaurant')} 
      />
      <FilterChip 
        icon="shopping-bag" 
        label="Tiendas" 
        isActive={activeCategory === 'shop'}
        onPress={() => onSelectCategory?.('shop')} 
      />
      <FilterChip 
        icon="plus-circle" 
        label="Servicios" 
        isActive={activeCategory === 'medical'}
        onPress={() => onSelectCategory?.('medical')} 
      />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  chipWrapper: {
    marginRight: 14,
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    fontFamily: typography.primary.medium,
    marginLeft: 10,
  },
  chipTextActive: {
    color: 'white',
    fontFamily: typography.primary.bold,
  },
});
