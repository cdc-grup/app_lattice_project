import React from 'react';
import { Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { mapIconName } from '../utils/poiUtils';
import { theme } from '../styles/theme';

interface FilterChipProps {
  label: string;
  icon: string;
  active?: boolean;
  onPress?: () => void;
}

export const FilterChip = React.memo(({ label, icon, active = false, onPress }: FilterChipProps) => {

  return (
    <Pressable
      onPress={onPress}
      testID="filter-chip"
      className={`flex-row items-center px-4 h-9 rounded-full mr-3 border active:opacity-70 ${
        active ? 'bg-primary border-primary' : 'border-transparent'
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
              backgroundColor: theme.glass.dark,
              borderColor: theme.glass.medium,
            }
      }
    >
      <Feather
        name={mapIconName(icon) as any}
        size={18}
        color="white"
        style={{ marginRight: 6 }}
      />
      <Text className="text-white font-medium text-sm">{label}</Text>
    </Pressable>
  );
});
