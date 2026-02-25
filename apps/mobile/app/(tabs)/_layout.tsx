import React from 'react';
import { Tabs } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { colors } from '../../src/styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconProps = {
  color: string;
  size: number;
};

interface TabConfig {
  name: string;
  title: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { name: 'home', title: 'Home', icon: 'Home' },
  { name: 'schedule', title: 'Schedule', icon: 'Calendar' },
  { name: 'index', title: 'Map', icon: 'Map' },
  { name: 'profile', title: 'Profile', icon: 'User' },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.navbar,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-Medium',
        },
      }}
    >
      {TABS.map((tab) => {
        const IconComponent = (LucideIcons as any)[tab.icon];
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, size }: IconProps) => (
                IconComponent ? <IconComponent size={size} color={color} strokeWidth={2} /> : null
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
