import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterChipProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive?: boolean;
  onPress?: () => void;
}

export const FilterChip = ({ 
  label, 
  icon, 
  isActive = false, 
  onPress 
}: FilterChipProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.8}
      className={`h-11 px-5 rounded-3xl flex-row items-center gap-2 mr-3 ${
        isActive 
          ? 'bg-primary shadow-[0_0_20px_rgba(255,56,46,0.5)] border border-primary/20' 
          : 'bg-white/10 border border-white/20 backdrop-blur-lg'
      }`}
    >
      <Ionicons 
        name={icon} 
        size={18} 
        color={isActive ? "white" : "#D1D5DB"} 
      />
      <Text className={`text-sm font-bold ${isActive ? 'text-white' : 'text-white/80'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterChip;
