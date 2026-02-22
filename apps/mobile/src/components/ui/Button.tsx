import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, ActivityIndicator } from 'react-native';
import Typography from './Typography';
import * as Haptics from 'expo-haptics';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onPress,
  disabled,
  ...props
}) => {
  const handlePress = (event: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) onPress(event);
  };

  let containerClasses = 'flex-row items-center justify-center rounded-xl transition-all ';
  let textVariant: 'body' | 'small' | 'h3' = 'body';
  let textWeight: 'bold' = 'bold';

  switch (variant) {
    case 'primary':
      containerClasses += 'bg-primary shadow-lg shadow-primary/40 active:translate-y-px ';
      break;
    case 'secondary':
      containerClasses += 'bg-secondary border border-white/5 ';
      break;
    case 'outline':
      containerClasses += 'bg-transparent border border-primary ';
      break;
    case 'ghost':
      containerClasses += 'bg-transparent ';
      break;
  }

  switch (size) {
    case 'sm':
      containerClasses += 'py-2 px-4 ';
      textVariant = 'small';
      break;
    case 'md':
      containerClasses += 'py-4 px-6 ';
      break;
    case 'lg':
      containerClasses += 'py-5 px-8 ';
      textVariant = 'h3';
      break;
  }

  if (disabled || loading) {
    containerClasses += 'opacity-50 ';
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      className={`${containerClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
          <Typography
            variant={textVariant}
            weight={textWeight}
            className={variant === 'outline' || variant === 'ghost' ? 'text-primary' : 'text-white'}
          >
            {title}
          </Typography>
          {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
