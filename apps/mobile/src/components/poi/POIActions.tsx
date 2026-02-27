import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface POIActionsProps {
  onNavigate: () => void;
  onBookmark?: () => void;
}

export const POIActions = React.memo(({ onNavigate, onBookmark }: POIActionsProps) => (
  <View className="mt-4 flex-row gap-3">
    <Pressable
      onPress={onNavigate}
      className="flex-1 bg-primary h-12 flex-row items-center justify-center rounded-xl active:opacity-90"
      style={styles.navigateButton}
      accessibilityLabel="Navigate to this location"
    >
      <Feather name="navigation" size={18} color="white" />
      <Text className="text-white font-bold ml-2">Navigate Here</Text>
    </Pressable>

    <Pressable
      onPress={onBookmark}
      className="w-12 h-12 items-center justify-center border rounded-xl border-transparent active:opacity-70"
      style={styles.bookmarkButton}
      accessibilityLabel="Bookmark this location"
    >
      <Feather name="bookmark" size={20} color="white" />
    </Pressable>
  </View>
));

const styles = StyleSheet.create({
  navigateButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  bookmarkButton: {
    backgroundColor: theme.glass.low,
    borderColor: theme.glass.medium,
  },
});

