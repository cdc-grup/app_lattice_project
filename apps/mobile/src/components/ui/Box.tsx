import React from 'react';
import { View, ViewProps } from 'react-native';

export interface BoxProps extends ViewProps {
  variant?: 'glass' | 'surface' | 'outline' | 'none';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Box Component
 * A premium container that implements the design system's aesthetic.
 */
export const Box = ({ 
  variant = 'glass', 
  className = '', 
  children, 
  ...props 
}: BoxProps) => {
  
  const variantStyles = {
    glass: 'bg-white/5 border border-white/10 rounded-[32px] overflow-hidden',
    surface: 'bg-surface border border-border/50 rounded-2xl',
    outline: 'border border-border/20 rounded-2xl',
    none: '',
  };

  return (
    <View 
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

export default Box;
