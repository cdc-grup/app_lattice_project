import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FooterActionProps {
  icon: string;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

const FooterAction = ({ icon, label, onPress, isLast }: FooterActionProps) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-center h-14 w-full bg-[#1c1c1e] mb-3 rounded-2xl active:opacity-70"
    style={styles.actionButton}
  >
    <Feather name={icon as any} size={20} color="#FF3B30" />
    <Text className="text-[#FF3B30] text-base font-semibold ml-3">{label}</Text>
  </Pressable>
);

export const SheetFooterActions = () => {
  return (
    <View className="mt-4 mb-10">
      <FooterAction 
        icon="share" 
        label="Compartir mi ubicación" 
        onPress={() => {}} 
      />
      <FooterAction 
        icon="map-pin" 
        label="Marcar mi ubicación" 
        onPress={() => {}} 
      />
      <FooterAction 
        icon="message-square" 
        label="Informar de un problema" 
        onPress={() => {}} 
      />
      
      <View className="items-center mt-4">
        <Pressable className="flex-row items-center">
            <Text className="text-gray-500 text-xs">Términos y condiciones</Text>
            <Feather name="chevron-right" size={12} color="#666" className="ml-0.5" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  }
});
