import React, { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../src/styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconProps = {
  color: string;
  size: number;
};

interface TabConfig {
  name: string;
  title: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
}

const TABS: TabConfig[] = [
  { name: 'home', title: 'Home', icon: 'home' },
  { name: 'schedule', title: 'Schedule', icon: 'calendar-month' },
  { name: 'index', title: 'Map', icon: 'map' },
  { name: 'profile', title: 'Profile', icon: 'account' },
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
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }: IconProps) => (
              <MaterialCommunityIcons name={tab.icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
