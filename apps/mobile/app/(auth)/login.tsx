import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Typography from '../../src/components/ui/Typography';
import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';

export default function LoginScreen() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'ticket' | 'account'>('ticket');
  const [ticketId, setTicketId] = useState('');

  const handleSyncAccess = () => {
    console.log('Syncing access for ticket:', ticketId);
    // router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="pt-20 pb-8 items-center">
              <View className="w-16 h-16 mb-6 rounded-2xl bg-primary items-center justify-center shadow-lg shadow-primary/50">
                <MaterialCommunityIcons name="racing-helmet" size={40} color="white" />
              </View>
              <Typography variant="h1" className="text-center mb-2">
                Welcome to the Grid
              </Typography>
              <Typography variant="small" className="text-muted text-center">
                Sync your pass or login to access race data.
              </Typography>
            </View>

            {/* Auth Mode Selector */}
            <View className="bg-black/20 p-1 rounded-2xl mb-8 flex-row border border-white/10">
              <TouchableOpacity 
                onPress={() => setAuthMode('ticket')}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'ticket' ? 'bg-primary' : ''}`}
              >
                <Typography 
                  weight="medium" 
                  variant="small"
                  className={authMode === 'ticket' ? 'text-white' : 'text-muted'}
                >
                  Fast Ticket Sync
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setAuthMode('account')}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'account' ? 'bg-primary' : ''}`}
              >
                <Typography 
                  weight="medium" 
                  variant="small"
                  className={authMode === 'account' ? 'text-white' : 'text-muted'}
                >
                  Account Sync
                </Typography>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 backdrop-blur-lg">
              {authMode === 'ticket' ? (
                <View>
                  <Input 
                    label="Enter Ticket ID"
                    value={ticketId}
                    onChangeText={setTicketId}
                    autoCapitalize="characters"
                    rightElement={
                      <TouchableOpacity className="p-1">
                        <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FF3B30" />
                      </TouchableOpacity>
                    }
                  />
                  
                  <View className="flex-row items-start bg-primary/10 border border-primary/20 p-3 rounded-xl mb-8">
                    <MaterialCommunityIcons name="information-outline" size={16} color="#FF3B30" className="mt-0.5 mr-2" />
                    <Typography variant="tiny" className="text-primary/80 flex-1 leading-relaxed">
                      Use the 8-digit code found on your physical pass or email confirmation.
                    </Typography>
                  </View>

                  <Button 
                    title="SYNC ACCESS"
                    onPress={handleSyncAccess}
                    icon={<MaterialCommunityIcons name="flash-outline" size={20} color="white" />}
                  />
                </View>
              ) : (
                <View>
                  <Input label="Email Address" keyboardType="email-address" autoCapitalize="none" />
                  <Input label="Password" secureTextEntry />
                  <Button title="LOGIN TO ACCOUNT" onPress={handleSyncAccess} />
                </View>
              )}
            </View>

            {/* Footer Actions */}
            <View className="items-center gap-y-6">
              <TouchableOpacity className="flex-row items-center">
                <Typography variant="small" className="text-muted mr-1">
                  Need help finding your ticket?
                </Typography>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#FF3B30" />
              </TouchableOpacity>

              <View className="flex-row items-center w-full py-4 mt-4">
                <View className="flex-1 h-[1px] bg-slate-800" />
                <Typography variant="tiny" className="mx-4 text-slate-500 uppercase tracking-widest">
                  Or continue with
                </Typography>
                <View className="flex-1 h-[1px] bg-slate-800" />
              </View>

              <View className="flex-row w-full gap-x-4">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/5 py-3 rounded-xl">
                  <MaterialCommunityIcons name="apple" size={20} color="white" className="mr-2" />
                  <Typography weight="medium" variant="small">Apple</Typography>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/5 py-3 rounded-xl">
                  <MaterialCommunityIcons name="google" size={20} color="white" className="mr-2" />
                  <Typography weight="medium" variant="small">Google</Typography>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
