import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'tiny';
  weight?: 'regular' | 'medium' | 'bold' | 'black';
  color?: string;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight = 'regular',
  color,
  className = '',
  style,
  children,
  ...props
}) => {
  let defaultClasses = '';

  switch (variant) {
    case 'h1':
      defaultClasses = 'text-4xl leading-tight';
      weight = weight === 'regular' ? 'black' : weight;
      break;
    case 'h2':
      defaultClasses = 'text-2xl leading-snug';
      weight = weight === 'regular' ? 'bold' : weight;
      break;
    case 'h3':
      defaultClasses = 'text-xl font-bold';
      break;
    case 'body':
      defaultClasses = 'text-base';
      break;
    case 'small':
      defaultClasses = 'text-sm';
      break;
    case 'tiny':
      defaultClasses = 'text-xs uppercase tracking-wider';
      break;
  }

  const weightClass = `font-${weight}`;

  return (
    <Text
      className={`${defaultClasses} ${weightClass} ${className}`}
      style={[{ color: color || '#FFFFFF' }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default Typography;
