import React from 'react';
import { View, TextInput, Pressable, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { theme } from '../styles/theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onArPress?: () => void;
}

export const SearchBar = React.memo(({
  placeholder = 'Find grandstands, food...',
  onSearch,
  onArPress,
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center px-4 pt-2 pb-4">
      {/* Search Input Container */}
      <View
        className="flex-1 flex-row items-center px-4 h-12 rounded-full"
        style={styles.searchContainer}
      >
        <Feather name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
        <TextInput
          className="flex-1 ml-3 text-white font-medium text-[16px] pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          onChangeText={onSearch}
          accessibilityLabel="Main search input"
          style={{ height: 48 }}
        />
        <Pressable className="pl-2 active:opacity-70" accessibilityLabel="Voice search">
          <Feather name="mic" size={20} color="rgba(255, 255, 255, 0.6)" />
        </Pressable>
      </View>

      {/* Profile Button */}
      <Pressable
        onPress={onArPress}
        className="w-12 h-12 ml-3 items-center justify-center rounded-full active:opacity-70 bg-[#1c1c1e] border border-white/5 shadow-lg"
        accessibilityLabel="Go to profile"
      >
        <View className="items-center justify-center">
          <Feather name="user" size={24} color="white" />
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: { 
    backgroundColor: '#1c1c1e', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
});
