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
      activeOpacity={0.7}
      className={`h-9 px-4 rounded-full flex-row items-center gap-2 mr-2 ${
        isActive 
          ? 'bg-primary shadow-lg shadow-primary/40' 
          : 'bg-black/50 border border-white/10 backdrop-blur-md'
      }`}
    >
      <Ionicons name={icon} size={16} color="white" />
      <Text className="text-white text-sm font-medium">{label}</Text>
    </TouchableOpacity>
  );
};

export default FilterChip;
