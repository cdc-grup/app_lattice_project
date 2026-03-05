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
  <View className="items-center mx-3.5">
    <Pressable
      onPress={onPress}
      style={[styles.actionButton, { backgroundColor: color === '#007AFF' ? 'rgba(0, 122, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)' }]}
      className="w-16 h-16 rounded-full items-center justify-center active:opacity-70"
    >
      <Feather name={icon as any} size={28} color={color} />
    </Pressable>
    <Text className="text-white text-[13px] font-medium mt-2">{label}</Text>
    {sublabel && <Text className="text-[#007AFF] text-[11px] mt-0.5">{sublabel}</Text>}
  </View>
);

export const QuickActions = () => {
  return (
    <View className="mt-7 mb-6">
      <View className="flex-row items-center mb-3 px-1">
        <Text className="text-white text-[19px] font-bold">Sitios</Text>
        <Feather name="chevron-right" size={16} color="rgba(255, 255, 255, 0.3)" className="ml-1 mt-0.5" />
      </View>
      <View className="flex-row items-start px-1">
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
          color="rgba(255, 255, 255, 0.4)"
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
