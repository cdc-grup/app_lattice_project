import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface POIActionsProps {
  onNavigate: () => void;
  onBookmark?: () => void;
}

export const POIActions = ({ onNavigate, onBookmark }: POIActionsProps) => (
  <View className="mt-4 flex-row gap-3">
    <TouchableOpacity
      onPress={onNavigate}
      className="flex-1 bg-primary h-12 flex-row items-center justify-center rounded-xl"
      style={{
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      <Feather name="navigation" size={18} color="white" />
      <Text className="text-white font-bold ml-2">Navigate Here</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onBookmark}
      className="w-12 h-12 items-center justify-center border rounded-xl border-transparent"
      style={{
        backgroundColor: theme.glass.low,
        borderColor: theme.glass.medium,
      }}
    >
      <Feather name="bookmark" size={20} color="white" />
    </TouchableOpacity>
  </View>
);

