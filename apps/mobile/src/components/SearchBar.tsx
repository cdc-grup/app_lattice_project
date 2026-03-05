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
    <View className="flex-row items-center space-x-3" style={{ paddingBottom: 8 }}>
      <View
        className="flex-1 flex-row items-center px-4 h-12 rounded-2xl"
        style={styles.searchContainer}
      >
        <Feather name="search" size={20} color="rgba(255, 255, 255, 0.4)" />
        <TextInput
          className="flex-1 ml-3 text-white font-medium text-[17px] pt-0 pb-0"
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          onChangeText={onSearch}
          accessibilityLabel="Main search input"
          style={{ height: 48 }}
        />
        <Pressable className="pl-2 active:opacity-70" accessibilityLabel="Voice search">
          <Feather name="mic" size={20} color="rgba(255, 255, 255, 0.4)" />
        </Pressable>
      </View>

      <Pressable
        onPress={onArPress}
        className="w-12 h-12 items-center justify-center rounded-full active:opacity-70"
        accessibilityLabel="Go to profile"
      >
        <View className="w-full h-full rounded-full bg-[#8E97C1] items-center justify-center shadow-lg">
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ND</Text>
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: { 
    backgroundColor: 'rgba(30, 30, 32, 0.95)', 
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
