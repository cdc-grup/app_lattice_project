import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { colors } from '../styles/colors';

interface FilterChipProps {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, icon, active = false, onPress }) => {
  const IconComponent = (LucideIcons as any)[icon];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      testID="filter-chip"
      className={`flex-row items-center px-4 h-9 rounded-full mr-3 border ${
        active ? 'bg-primary border-primary' : 'border-transparent' // Using inline styles for colors with opacity to avoid NativeWind bug
      }`}
      style={
        active
          ? {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 5,
            }
          : {
              backgroundColor: 'rgba(24, 24, 27, 0.8)', // surface/80
              borderColor: 'rgba(255, 255, 255, 0.1)', // white/10
            }
      }
    >
      {IconComponent && (
        <IconComponent
          size={18}
          color="white"
          style={{ marginRight: 6 }}
          strokeWidth={active ? 2.5 : 2}
        />
      )}
      <Text className="text-white font-medium text-sm">{label}</Text>
    </TouchableOpacity>
  );
};
