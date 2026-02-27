import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
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
    <View className="flex-row items-center gap-3 px-4 pt-12">
      <View
        className="flex-1 flex-row items-center bg-surface/80 px-4 h-12 rounded-full border border-white/10"
        style={styles.searchContainer}
      >
        <Feather name="search" size={20} color={colors.muted} />
        <TextInput
          className="flex-1 ml-2 text-white font-medium text-sm pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          onChangeText={onSearch}
          accessibilityLabel="Main search input"
        />
        <Pressable className="active:opacity-70" accessibilityLabel="Voice search">
          <Feather name="mic" size={20} color={colors.muted} />
        </Pressable>
      </View>

      <Pressable
        onPress={onArPress}
        className="w-12 h-12 items-center justify-center rounded-full border border-transparent active:opacity-70"
        style={styles.arButton}
        accessibilityLabel="Open augmented reality"
      >
        <Feather name="camera" size={22} color="white" />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: { 
    backgroundColor: theme.glass.dark, 
    borderColor: theme.glass.medium 
  },
  arButton: {
    backgroundColor: theme.glass.dark,
    borderColor: theme.glass.medium,
  },
});
