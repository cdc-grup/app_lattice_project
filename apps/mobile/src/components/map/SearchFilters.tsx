import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface FilterChipProps {
  icon: any;
  label: string;
  onPress: () => void;
  IconComponent?: any;
}

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
}

export const SearchFilters = ({ onSelectCategory }: SearchFiltersProps) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
      className="mb-4"
    >
      <FilterChip 
        icon="log-in" 
        label="Gates" 
        onPress={() => onSelectCategory?.('gates')} 
      />
      <FilterChip 
        icon="map" 
        label="Grandstands" 
        onPress={() => onSelectCategory?.('grandstands')} 
      />
      <FilterChip 
        icon="coffee" 
        label="Food" 
        onPress={() => onSelectCategory?.('food')} 
      />
      <FilterChip 
        icon="shopping-bag" 
        label="Merch" 
        onPress={() => onSelectCategory?.('merch')} 
      />
    </ScrollView>
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
