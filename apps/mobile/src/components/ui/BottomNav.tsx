import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive?: boolean;
  onPress?: () => void;
}

const NavItem = ({ label, icon, isActive, onPress }: NavItemProps) => {
  const color = isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="items-center gap-1 py-1"
    >
      <Ionicons name={isActive ? icon.replace('-outline', '') as any : icon} size={24} color={color} />
      <Text 
        className={`text-[10px] uppercase font-bold tracking-tighter ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const BottomNav = () => {
  return (
    <View className="bg-background/80 border-t border-white/5 px-8 pt-2 pb-8 flex-row justify-between items-center backdrop-blur-xl">
      <NavItem label="Home" icon="home-outline" />
      <NavItem label="Schedule" icon="calendar-outline" />
      <NavItem label="Map" icon="map-outline" isActive />
      <NavItem label="Profile" icon="person-outline" />
    </View>
  );
};

export default BottomNav;
