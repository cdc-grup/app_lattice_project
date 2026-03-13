import React from 'react';
import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface SettingItemProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  type?: 'toggle' | 'link';
  destructive?: boolean;
  secondaryText?: string;
  iconBgColor?: string;
}

export const SettingItem = React.memo(({ 
  label, 
  icon, 
  value, 
  onValueChange, 
  onPress, 
  type = 'link',
  destructive = false,
  secondaryText,
  iconBgColor
}: SettingItemProps) => {
  const iconColor = destructive ? "#FF3B30" : (iconBgColor ? 'white' : colors.primary);
  const bgColor = iconBgColor || (destructive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(225, 6, 0, 0.1)');

  return (
    <Pressable 
      onPress={type === 'link' ? onPress : undefined}
      className={`flex-row justify-between items-center py-4 px-5 border-b border-white/5 ${type === 'link' ? 'active:bg-white/5' : ''}`}
      accessibilityRole={type === 'link' ? 'button' : 'none'}
    >
      <View className="flex-row items-center flex-1">
        <View 
          className="w-10 h-10 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: bgColor }}
        >
          <Feather name={icon} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className={`text-base font-medium ${destructive ? 'text-red-500 font-bold' : 'text-white'}`}>
            {label}
          </Text>
          {secondaryText ? (
            <Text className="text-primary text-xs mt-0.5">{secondaryText}</Text>
          ) : null}
        </View>
      </View>

      {type === 'toggle' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ false: '#374151', true: colors.primary }}
          thumbColor={'#ffffff'}
        />
      ) : (
        <Feather name="chevron-right" size={24} color={destructive ? "#FF3B30" : "#9ca3af"} />
      )}
    </Pressable>
  );
});
