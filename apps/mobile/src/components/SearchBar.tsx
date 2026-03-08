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
    <View className="flex-row items-center px-4 pt-4 pb-2">
      {/* Search Input Container */}
      <View
        className="flex-1 flex-row items-center px-4 h-11 rounded-xl"
        style={styles.searchContainer}
      >
        <Feather name="search" size={18} color="rgba(255, 255, 255, 0.4)" />
        <TextInput
          className="flex-1 ml-2 text-white font-normal text-[17px] pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.35)"
          onChangeText={onSearch}
          accessibilityLabel="Main search input"
          style={{ height: 44 }}
        />
        <Pressable 
          style={({ pressed }) => ({ 
            opacity: pressed ? 0.6 : 1,
          })}
          className="pl-2" 
          accessibilityLabel="Voice search"
        >
          <Feather name="mic" size={18} color="rgba(255, 255, 255, 0.5)" />
        </Pressable>
      </View>

      {/* Profile Button */}
      <Pressable
        onPress={onArPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        })}
        className="w-11 h-11 ml-3 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-sm"
        accessibilityLabel="Go to profile"
      >
        <View className="items-center justify-center">
          <Feather name="user" size={22} color="rgba(255, 255, 255, 0.9)" />
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
