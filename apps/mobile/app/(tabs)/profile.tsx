import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { colors } from '../../src/styles/colors';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, activeTicket, tickets, setTicket, addTicketToWallet, logout } = useAuthStore();
  const router = useRouter();
  
  // Local state for toggles
  const [avoidStairs, setAvoidStairs] = useState(false);
  const [avoidCrowds, setAvoidCrowds] = useState(false);
  const [avoidSlopes, setAvoidSlopes] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
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
              <MaterialCommunityIcons name="account" size={48} color={colors.primary} />
            </View>
          </View>
          <Text className="text-white text-2xl font-black mb-1">
            {user ? user.fullName : 'Guest Account'}
          </Text>
          <Text className="text-muted text-base">
            {user ? `@${user.fullName.replace(/\s+/g, '').toLowerCase()}` : 'Not logged in'}
          </Text>
          
          <TouchableOpacity 
            className="mt-6 bg-primary py-3 px-8 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 mb-8 mt-4">
          {/* List Section */}
          <View className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-lg">
            
            {/* Ticket Wallet Item */}
            <TouchableOpacity 
              onPress={() => {
                if (tickets && tickets.length > 0) {
                  // In a real app, this would navigate to a dedicated wallet screen
                  Alert.alert('Wallet', `You have ${tickets.length} tickets. Active: ${activeTicket?.code}`);
                } else {
                  router.push('/scan');
                }
              }}
              className="flex-row justify-between items-center py-4 px-5 border-b border-white/5"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-4">
                  <MaterialCommunityIcons name="ticket-confirmation" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text className="text-white text-base font-medium">Ticket Wallet</Text>
                  {activeTicket && (
                    <Text className="text-primary text-xs mt-0.5">Active: {activeTicket.code}</Text>
                  )}
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>

            {/* Scan Ticket Item */}
            <TouchableOpacity 
              onPress={() => router.push('/scan')}
              className="flex-row justify-between items-center py-4 px-5 border-b border-white/5"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-4">
                  <MaterialCommunityIcons name="qrcode-scan" size={20} color={colors.primary} />
                </View>
                <Text className="text-white text-base font-medium">Scan Ticket</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <View className="px-5 py-3 bg-black/20">
              <Text className="text-muted text-xs font-bold uppercase tracking-wider">Routing Preferences</Text>
            </View>

            {/* Avoid Stairs Toggle */}
            <View className="flex-row justify-between items-center py-4 px-5 border-b border-white/5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center mr-4">
                  <MaterialCommunityIcons name="stairs" size={20} color="white" />
                </View>
                <Text className="text-white text-base font-medium">Avoid Stairs</Text>
              </View>
              <Switch 
                value={avoidStairs} 
                onValueChange={setAvoidStairs} 
                trackColor={{ false: '#374151', true: colors.primary }}
                thumbColor={'#ffffff'}
              />
            </View>

            {/* Avoid Crowds Toggle */}
            <View className="flex-row justify-between items-center py-4 px-5 border-b border-white/5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center mr-4">
                  <MaterialCommunityIcons name="account-group" size={20} color="white" />
                </View>
                <Text className="text-white text-base font-medium">Avoid Crowds</Text>
              </View>
              <Switch 
                value={avoidCrowds} 
                onValueChange={setAvoidCrowds} 
                trackColor={{ false: '#374151', true: colors.primary }}
                thumbColor={'#ffffff'}
              />
            </View>

            {/* Avoid Slopes Toggle */}
            <View className="flex-row justify-between items-center py-4 px-5 border-b border-white/5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center mr-4">
                  <MaterialCommunityIcons name="slope-uphill" size={20} color="white" />
                </View>
                <Text className="text-white text-base font-medium">Avoid Steep Slopes</Text>
              </View>
              <Switch 
                value={avoidSlopes} 
                onValueChange={setAvoidSlopes} 
                trackColor={{ false: '#374151', true: colors.primary }}
                thumbColor={'#ffffff'}
              />
            </View>

            {/* Theme Link */}
            <TouchableOpacity className="flex-row justify-between items-center py-4 px-5 border-b border-white/5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center mr-4">
                  <MaterialCommunityIcons name="palette-outline" size={20} color="white" />
                </View>
                <Text className="text-white text-base font-medium">Theme</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
            
            <View className="px-5 py-3 bg-black/20">
              <Text className="text-muted text-xs font-bold uppercase tracking-wider">Account</Text>
            </View>

            {/* Logout Item */}
            <TouchableOpacity 
              onPress={handleLogout}
              className="flex-row justify-between items-center py-4 px-5"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-red-500/10 items-center justify-center mr-4">
                  <MaterialCommunityIcons name="logout" size={20} color={colors.red[500]} />
                </View>
                <Text className="text-red-500 text-base font-bold">Log out</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.red[500]} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
