import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface QuickActionProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  color?: string;
}

const QuickAction = ({ icon, label, sublabel, onPress, color = '#007AFF' }: QuickActionProps) => (
  <View className="items-center mx-3">
    <Pressable
      onPress={onPress}
      style={[styles.actionButton, { backgroundColor: color === '#007AFF' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)' }]}
      className="w-16 h-16 rounded-full items-center justify-center active:opacity-70"
    >
      <Feather name={icon as any} size={30} color={color} />
    </Pressable>
    <Text className="text-white text-xs font-semibold mt-2">{label}</Text>
    {sublabel && <Text className="text-blue-500 text-[10px] mt-0.5">{sublabel}</Text>}
  </View>
);

export const QuickActions = () => {
  return (
    <View className="mt-6 mb-8">
      <View className="flex-row items-center mb-4 px-1">
        <Text className="text-white text-xl font-bold">Sitios</Text>
        <Feather name="chevron-right" size={20} color="#666" className="ml-1" />
      </View>
      <View className="flex-row items-start">
        <QuickAction 
          icon="home" 
          label="Casa" 
          sublabel="Añadir" 
          onPress={() => {}} 
        />
        <QuickAction 
          icon="briefcase" 
          label="Trabajo" 
          sublabel="Añadir" 
          onPress={() => {}} 
        />
        <QuickAction 
          icon="plus" 
          label="Añadir" 
          onPress={() => {}} 
          color="#999"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});
