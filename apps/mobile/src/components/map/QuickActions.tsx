import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface QuickActionProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isRed?: boolean;
}

const QuickAction = ({ icon, label, sublabel, onPress, isRed }: QuickActionProps) => (
  <View className="items-center mr-6">
    <Pressable 
      onPress={onPress}
      style={[
        styles.actionButton,
        { backgroundColor: isRed ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 255, 255, 0.08)' }
      ]}
      className="w-14 h-14 rounded-full items-center justify-center mb-2 active:opacity-70"
    >
      <Feather name={icon as any} size={24} color={isRed ? '#FF3B30' : '#94A3B8'} />
    </Pressable>
    <Text className="text-white text-xs font-medium">{label}</Text>
    {sublabel && <Text className="text-[#FF3B30] text-[10px] mt-0.5">{sublabel}</Text>}
  </View>
);

export const QuickActions = () => {
  return (
    <View className="px-5 py-4">
      <View className="flex-row items-center mb-4">
        <Text className="text-white text-[19px] font-bold">Sitios</Text>
        <Feather name="chevron-right" size={16} color="rgba(255, 255, 255, 0.3)" className="ml-1 mt-0.5" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        <QuickAction 
          icon="home" 
          label="Casa" 
          sublabel="Añadir" 
          onPress={() => {}} 
          isRed
        />
        <QuickAction 
          icon="briefcase" 
          label="Trabajo" 
          sublabel="Añadir" 
          onPress={() => {}} 
          isRed
        />
        <QuickAction 
          icon="plus" 
          label="Añadir" 
          onPress={() => {}} 
          isRed
        />
      </ScrollView>
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
