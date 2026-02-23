import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
              <Text className="text-h1 font-black text-white text-center mb-2">
                Welcome to the Grid
              </Text>
              <Text className="text-small text-muted text-center">
                Sync your pass or login to access race data.
              </Text>
            </View>

            {/* Auth Mode Selector */}
            <View className="bg-black/20 p-1 rounded-2xl mb-8 flex-row border border-white/10">
              <TouchableOpacity 
                onPress={() => setAuthMode('ticket')}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'ticket' ? 'bg-primary' : ''}`}
              >
                <Text 
                  className={`text-small font-medium ${authMode === 'ticket' ? 'text-white' : 'text-muted'}`}
                >
                  Fast Ticket Sync
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setAuthMode('account')}
                className={`flex-1 py-3 px-4 rounded-xl items-center ${authMode === 'account' ? 'bg-primary' : ''}`}
              >
                <Text 
                  className={`text-small font-medium ${authMode === 'account' ? 'text-white' : 'text-muted'}`}
                >
                  Account Sync
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 backdrop-blur-lg">
              {authMode === 'ticket' ? (
                <View>
                  {/* Standard Input replacement */}
                  <View className="mb-6">
                    <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                      Ticket ID
                    </Text>
                    <View className="flex-row items-center border-b border-slate-700 py-1">
                      <TextInput 
                        className="flex-1 text-white text-lg py-2"
                        value={ticketId}
                        onChangeText={setTicketId}
                        autoCapitalize="characters"
                        placeholder="EX: CIRCUIT25"
                        placeholderTextColor="#4b5563"
                      />
                      <TouchableOpacity className="p-1">
                        <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View className="flex-row items-start bg-primary/10 border border-primary/20 p-3 rounded-xl mb-8">
                    <MaterialCommunityIcons name="information-outline" size={16} color="#FF3B30" className="mt-0.5 mr-2" />
                    <Text className="text-tiny text-primary/80 flex-1 leading-relaxed">
                      Use the 8-digit code found on your physical pass or email confirmation.
                    </Text>
                  </View>

                  {/* Standard Button replacement */}
                  <TouchableOpacity 
                    onPress={handleSyncAccess}
                    className="bg-primary py-4 px-6 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/40 active:translate-y-px"
                  >
                    <View className="mr-2">
                       <MaterialCommunityIcons name="flash-outline" size={20} color="white" />
                    </View>
                    <Text className="text-white font-bold">
                      SYNC ACCESS
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View className="mb-6">
                    <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                      Email Address
                    </Text>
                    <TextInput 
                      className="border-b border-slate-700 text-white text-lg py-3"
                      keyboardType="email-address" 
                      autoCapitalize="none" 
                      placeholder="user@example.com"
                      placeholderTextColor="#4b5563"
                    />
                  </View>
                  <View className="mb-8">
                    <Text className="text-tiny font-medium text-primary mb-1 uppercase tracking-wider">
                      Password
                    </Text>
                    <TextInput 
                      className="border-b border-slate-700 text-white text-lg py-3"
                      secureTextEntry 
                      placeholder="••••••••"
                      placeholderTextColor="#4b5563"
                    />
                  </View>
                  <TouchableOpacity 
                    onPress={handleSyncAccess}
                    className="bg-primary py-4 px-6 rounded-xl items-center justify-center shadow-lg shadow-primary/40 active:translate-y-px"
                  >
                    <Text className="text-white font-bold">
                      LOGIN TO ACCOUNT
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Footer Actions */}
            <View className="items-center gap-y-6">
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-small text-muted mr-1">
                  Need help finding your ticket?
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#FF3B30" />
              </TouchableOpacity>

              <View className="flex-row items-center w-full py-4 mt-4">
                <View className="flex-1 h-[1px] bg-slate-800" />
                <Text className="text-tiny mx-4 text-slate-500 uppercase tracking-widest">
                  Or continue with
                </Text>
                <View className="flex-1 h-[1px] bg-slate-800" />
              </View>

              <View className="flex-row w-full gap-x-4">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/5 py-3 rounded-xl">
                  <MaterialCommunityIcons name="apple" size={20} color="white" className="mr-2" />
                  <Text className="text-small font-medium text-white">Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white/5 border border-white/5 py-3 rounded-xl">
                  <MaterialCommunityIcons name="google" size={20} color="white" className="mr-2" />
                  <Text className="text-small font-medium text-white">Google</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
