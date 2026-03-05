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
  placeholder = 'Mapas de Apple',
  onSearch,
  onArPress,
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center space-x-2">
      <View
        className="flex-1 flex-row items-center bg-surface/80 px-3 h-11 rounded-2xl border border-white/10"
        style={styles.searchContainer}
      >
        <Feather name="search" size={20} color={colors.muted} />
        <TextInput
          className="flex-1 ml-2 text-white font-medium text-base pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          onChangeText={onSearch}
          accessibilityLabel="Main search input"
        />
        <Pressable className="px-2 active:opacity-70" accessibilityLabel="Voice search">
          <Feather name="mic" size={20} color={colors.muted} />
        </Pressable>
      </View>

      <Pressable
        onPress={onArPress}
        className="w-11 h-11 items-center justify-center rounded-full border border-transparent active:opacity-70"
        style={styles.arButton}
        accessibilityLabel="Go to profile"
      >
        <View className="w-9 h-9 rounded-full bg-slate-700 items-center justify-center">
          <Text className="text-white font-bold text-sm">ND</Text>
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: { 
    backgroundColor: 'rgba(30, 30, 35, 0.8)', 
    borderColor: 'rgba(255, 255, 255, 0.1)' 
  },
  arButton: {
    backgroundColor: 'transparent',
  },
});
