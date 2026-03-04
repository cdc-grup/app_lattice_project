import React from 'react';
import { 
  Pressable, 
  Text, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle, 
  StyleProp 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../styles/colors';

interface PremiumButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const PremiumButton = ({
  onPress,
  label,
  variant = 'primary',
  icon,
  isLoading = false,
  disabled = false,
  className = '',
  style
}: PremiumButtonProps) => {
  const handlePress = () => {
    if (disabled || isLoading) return;
    Haptics.impactAsync(
      variant === 'primary' 
        ? Haptics.ImpactFeedbackStyle.Medium 
        : Haptics.ImpactFeedbackStyle.Light
    );
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#FF3B30] shadow-[#FF3B30]/20';
      case 'secondary':
        return 'bg-white shadow-white/10';
      case 'outline':
        return 'bg-white/5 border border-white/10';
      default:
        return 'bg-[#FF3B30]';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-black';
      case 'outline':
        return 'text-white/80';
      default:
        return 'text-white';
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading}
      className={`h-16 rounded-2xl flex-row items-center justify-center px-6 shadow-2xl active:scale-[0.98] ${getVariantStyles()} ${disabled ? 'opacity-50' : 'active:opacity-90'} ${className}`}
      style={style}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'secondary' ? 'black' : 'white'} />
      ) : (
        <>
          {icon ? (
            <MaterialCommunityIcons 
              name={icon as any} 
              size={22} 
              color={variant === 'secondary' ? 'black' : 'white'} 
              className="mr-3"
            />
          ) : null}
          <Text className={`text-lg font-bold ${getTextStyles()} ${icon ? 'ml-3' : ''}`}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};
