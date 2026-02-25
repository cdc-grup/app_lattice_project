import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onArPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Find grandstands, food...',
  onSearch,
  onArPress,
}) => {
  return (
    <View className="flex-row items-center gap-3 px-4 pt-12">
      <View
        className="flex-1 flex-row items-center bg-surface/80 px-4 h-12 rounded-full border border-white/10"
      >
        <Feather name="search" size={20} color={colors.muted} />
        <TextInput
          className="flex-1 ml-2 text-white font-medium text-sm pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          onChangeText={onSearch}
        />
        <TouchableOpacity>
          <Feather name="mic" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onArPress}
        className="w-12 h-12 items-center justify-center rounded-full border border-transparent"
        style={{
          backgroundColor: 'rgba(24, 24, 27, 0.8)', // surface/80
          borderColor: 'rgba(255, 255, 255, 0.1)', // white/10
        }}
      >
        <Feather name="camera" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};
