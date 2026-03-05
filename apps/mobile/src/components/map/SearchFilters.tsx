import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
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
    style={styles.chip}
    className="flex-row items-center px-4 h-[38px] rounded-full mr-2.5 active:opacity-70"
  >
    <IconComponent name={icon} size={18} color="white" />
    <Text style={styles.chipText}>{label}</Text>
  </Pressable>
);

export const SearchFilters = () => {
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
        onPress={() => {}} 
      />
      <FilterChip 
        icon="map" 
        label="Grandstands" 
        onPress={() => {}} 
      />
      <FilterChip 
        icon="coffee" 
        label="Food" 
        onPress={() => {}} 
      />
      <FilterChip 
        icon="shopping-bag" 
        label="Merch" 
        onPress={() => {}} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  chipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
