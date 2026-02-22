import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box } from './Box';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onARToggle?: () => void;
}

export const SearchBar = ({ 
  placeholder = "Find grandstands, food...", 
  onSearch,
  onARToggle 
}: SearchBarProps) => {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1 bg-black/50 border border-white/10 rounded-full h-12 px-4 flex-row items-center backdrop-blur-xl">
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-2 text-white font-medium text-sm"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={onSearch}
        />
        <TouchableOpacity>
          <Ionicons name="mic" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={onARToggle}
        className="w-12 h-12 bg-black/50 border border-white/10 rounded-full items-center justify-center backdrop-blur-xl"
      >
        <Ionicons name="cube-outline" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
