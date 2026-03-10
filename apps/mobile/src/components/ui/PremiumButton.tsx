import React from 'react';
import { 
  Pressable, 
  Text, 
  ActivityIndicator, 
  ViewStyle, 
  StyleProp,
  View,
  StyleSheet
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'white';
  icon?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string; // Kept for tailwind class logic outside
  style?: StyleProp<ViewStyle>;
}

/**
 * High-end interactive button with standardized gradients.
 * Explicitly uses LinearGradient without interop for maximum robustness.
 */
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

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [colors.primary, '#7A646F'] as const;
      case 'secondary':
        return [colors.secondary, '#5C5A59'] as const;
      case 'glass':
        return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const;
      case 'white':
        return ['#FFFFFF', '#F6F6F6'] as const;
      default:
        return null;
    }
  };

  const getSecondaryStyles = () => {
    if (variant === 'outline') return 'border border-white/20 bg-transparent';
    if (variant === 'glass') return 'border border-white/10';
    if (variant === 'white') return 'shadow-lg';
    return '';
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return { color: '#FFFFFF', fontWeight: '700' } as const;
      case 'secondary':
        return { color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' } as const;
      case 'outline':
        return { color: '#FFFFFF', fontWeight: '500' } as const;
      case 'glass':
        return { color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' } as const;
      case 'white':
        return { color: '#000000', fontWeight: '700' } as const;
      default:
        return { color: '#FFFFFF' } as const;
    }
  };

  const gradientColors = getGradientColors();

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading}
      className={`h-14 rounded-2xl overflow-hidden active:scale-[0.98] ${disabled ? 'opacity-50' : 'active:opacity-90'} ${className}`}
      style={style}
    >
      {gradientColors && (
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      
      <View 
        className={`flex-1 flex-row items-center justify-center px-6 ${getSecondaryStyles()}`}
      >
        {isLoading ? (
          <ActivityIndicator color={variant === 'white' ? 'black' : 'white'} />
        ) : (
          <>
            {icon && (
              <MaterialCommunityIcons 
                name={icon as any} 
                size={20} 
                color={variant === 'white' ? 'black' : 'white'} 
                style={{ marginRight: 8 }}
              />
            )}
            <Text 
              className="text-base tracking-tight"
              style={getTextStyle()}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
};
