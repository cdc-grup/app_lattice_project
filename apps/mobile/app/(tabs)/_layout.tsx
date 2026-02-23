import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../src/styles/colors';

type IconProps = {
  color: string;
  size: number;
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.navbar,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#FF3B30',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Circuit',
          tabBarIcon: ({ color, size }: IconProps) => (
            <MaterialCommunityIcons name="map-marker-radius" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
