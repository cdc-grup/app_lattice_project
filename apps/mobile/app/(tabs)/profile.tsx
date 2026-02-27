import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';
import { useRouter } from 'expo-router';
import { SettingItem } from '../../src/components/ui/SettingItem';

export default function ProfileScreen() {
  const { user, activeTicket, tickets, logout } = useAuthStore();
  const router = useRouter();
  
  // Local state for toggles
  const [avoidStairs, setAvoidStairs] = useState(false);
  const [avoidCrowds, setAvoidCrowds] = useState(false);
  const [avoidSlopes, setAvoidSlopes] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="pt-12 pb-8 items-center">
          <View className="mb-4">
            <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center border-2 border-primary">
              <Feather name="user" size={48} color={colors.primary} />
            </View>
          </View>
          <Text className="text-white text-2xl font-black mb-1">
            {user ? user.fullName : 'Guest Account'}
          </Text>
          <Text className="text-muted text-base">
            {user ? `@${user.fullName.replace(/\s+/g, '').toLowerCase()}` : 'Not logged in'}
          </Text>
          
          <Pressable 
            className="mt-6 bg-primary py-3 px-8 rounded-full active:opacity-90"
          >
            <Text className="text-white font-bold text-base">Edit Profile</Text>
          </Pressable>
        </View>

        <View className="px-4 mb-8 mt-4">
          {/* List Section */}
          <View className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            
            <SettingItem 
              label="Ticket Wallet"
              icon="tag"
              secondaryText={activeTicket ? `Active: ${activeTicket.code}` : undefined}
              onPress={() => {
                if (tickets && tickets.length > 0) {
                  Alert.alert('Wallet', `You have ${tickets.length} tickets. Active: ${activeTicket?.code}`);
                } else {
                  router.push('/scan' as any);
                }
              }}
            />

            <SettingItem 
              label={user?.hasTicket ? 'Ticket Active ✓' : 'Scan & Link Ticket'}
              icon="maximize"
              onPress={() => {
                if (user && !user.hasTicket) {
                  Alert.alert(
                    "Link Ticket",
                    "Choose a method to link your ticket",
                    [
                      { text: "Scan QR", onPress: () => router.push('/scan' as any) },
                      {
                        text: "Simulate Scan",
                        onPress: async () => {
                          const success = await useAuthStore.getState().claimTicket('CIRCUIT25');
                          if (success) Alert.alert('Success', 'Ticket claimed successfully!');
                          else Alert.alert('Error', 'Could not claim ticket');
                        }
                      },
                      { text: "Cancel", style: "cancel" }
                    ]
                  );
                } else if (user?.hasTicket) {
                  Alert.alert('Notice', 'You already have an active ticket linked.');
                } else {
                  router.push('/scan' as any);
                }
              }}
            />

            <View className="px-5 py-3 bg-black/20">
              <Text className="text-muted text-xs font-bold uppercase tracking-wider">Routing Preferences</Text>
            </View>

            <SettingItem 
              label="Avoid Stairs"
              icon="chevron-left"
              type="toggle"
              value={avoidStairs}
              onValueChange={setAvoidStairs}
              iconBgColor="rgba(255, 255, 255, 0.1)"
            />

            <SettingItem 
              label="Avoid Crowds"
              icon="users"
              type="toggle"
              value={avoidCrowds}
              onValueChange={setAvoidCrowds}
              iconBgColor="rgba(255, 255, 255, 0.1)"
            />

            <SettingItem 
              label="Avoid Steep Slopes"
              icon="alert-triangle"
              type="toggle"
              value={avoidSlopes}
              onValueChange={setAvoidSlopes}
              iconBgColor="rgba(255, 255, 255, 0.1)"
            />

            <SettingItem 
              label="Theme"
              icon="package"
              iconBgColor="rgba(255, 255, 255, 0.1)"
              onPress={() => Alert.alert('Info', 'Theme switching coming soon!')}
            />
            
            <View className="px-5 py-3 bg-black/20">
              <Text className="text-muted text-xs font-bold uppercase tracking-wider">Account</Text>
            </View>

            <SettingItem 
              label="Log out"
              icon="log-out"
              destructive
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
