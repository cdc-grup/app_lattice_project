import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface QuickActionProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isRed?: boolean;
}

const QuickAction = ({ icon, label, sublabel, onPress, color }: QuickActionProps & { color: string }) => (
  <View style={styles.actionItem}>
    <Pressable 
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.actionButton,
        { 
          backgroundColor: pressed ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          borderColor: pressed ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
          transform: [{ scale: pressed ? 0.94 : 1 }],
        }
      ]}
      className="items-center justify-center mb-2"
    >
      <Feather name={icon as any} size={24} color={color} />
    </Pressable>
    <Text style={styles.actionLabel} numberOfLines={1}>{label}</Text>
    {sublabel ? (
      <Text style={[styles.actionSublabel, { color: `${color}90` }]} numberOfLines={1}>{sublabel}</Text>
    ) : null}
  </View>
);

export const QuickActions = () => {
  return (
    <View style={styles.container}>
      <View className="flex-row items-center mb-4">
        <Text style={styles.sectionTitle}>Favoritos</Text>
        <Feather name="chevron-right" size={14} color="rgba(255, 255, 255, 0.3)" className="ml-1 mt-0.5" />
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <QuickAction 
          icon="home" 
          label="Casa" 
          sublabel="Añadir" 
          color="#0A84FF"
          onPress={() => console.log('Home pressed')} 
        />
        <QuickAction 
          icon="briefcase" 
          label="Trabajo" 
          sublabel="Añadir" 
          color="#FF9F0A"
          onPress={() => console.log('Work pressed')} 
        />
        <QuickAction 
          icon="plus" 
          label="Añadir" 
          color="rgba(255, 255, 255, 0.7)"
          onPress={() => console.log('Add pressed')} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingRight: 20,
  },
  actionItem: {
    minWidth: 70,
    alignItems: 'center',
    marginRight: 12,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 20, // Increased to 20px
    borderWidth: 1.5,
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  actionSublabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    marginTop: 1,
  },
});
