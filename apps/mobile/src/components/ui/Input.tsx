import React, { useState } from 'react';
import { View, TextInput, TextInputProps, Animated, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import Typography from './Typography';

interface InputProps extends TextInputProps {
  label: string;
  rightElement?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  rightElement,
  error,
  containerClassName = '',
  onFocus,
  onBlur,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#9CA3AF', '#FF3B30'],
    }),
  };

  return (
    <View className={`mb-6 ${containerClassName}`}>
      <View className="relative border-b border-slate-700 py-2">
        <Animated.Text
          style={[
            {
              position: 'absolute',
              left: 0,
              fontFamily: 'Inter-Medium',
            },
            labelStyle,
          ] as any}
        >
          {label}
        </Animated.Text>
        <View className="flex-row items-center">
          <TextInput
            className="flex-1 text-white text-lg py-2 mt-2"
            onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
              setIsFocused(true);
              if (onFocus) onFocus(e as any);
            }}
            onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
              setIsFocused(false);
              if (onBlur) onBlur(e as any);
            }}
            selectionColor="#FF3B30"
            placeholder=""
            value={value}
            {...props}
          />
          {rightElement && <View className="ml-2 mt-2">{rightElement}</View>}
        </View>
      </View>
      {error && (
        <Typography variant="tiny" className="text-primary mt-1">
          {error}
        </Typography>
      )}
    </View>
  );
};

export default Input;
