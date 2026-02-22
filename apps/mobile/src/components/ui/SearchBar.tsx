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
      <View className="flex-1 bg-white/10 border border-white/20 rounded-2xl h-14 px-5 flex-row items-center backdrop-blur-2xl">
        <Ionicons name="search-outline" size={20} color="#D1D5DB" />
        <TextInput
          className="flex-1 ml-3 text-white font-medium text-base"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={onSearch}
        />
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="mic-outline" size={20} color="#D1D5DB" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={onARToggle}
        activeOpacity={0.7}
        className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl items-center justify-center backdrop-blur-2xl"
      >
        <Ionicons name="cube-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
