# Pantalla d'Inici de Sessió i Onboarding

Aquest document conté el codi d'implementació de la pantalla d'**Inici de Sessió i Onboarding** de l'aplicació.

## 📱 Implementació en React Native

El següent component `RaceGridLogin` implementa la interfície d'usuari per a l'autenticació i la sincronització d'entrades.

```tsx
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';

export default function RaceGridScreen() {
  return (
    <View className="flex-1 bg-neutral-950 relative">
      <StatusBar barStyle="light-content" />
      
      {/* Background Ambience */}
      <View className="absolute w-full h-full left-0 top-0 overflow-hidden">
        <View className="w-[500px] h-[500px] absolute -left-10 -top-20 opacity-20 bg-red-500 rounded-full blur-3xl" />
        <View className="w-[800px] h-[600px] absolute -left-[400px] top-[280px] opacity-10 bg-red-900 rounded-full blur-3xl" />
      </View>

      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
          <View className="flex-col justify-between min-h-[850px]">
            
            {/* Header */}
            <View className="items-center pt-8 pb-6 w-full">
              <View className="pb-6 items-start">
                <View className="w-16 h-16 bg-red-600 rounded-2xl shadow-lg shadow-red-500/40 justify-center items-center">
                  <View className="w-7 h-6 bg-white" />
                </View>
              </View>
              <View className="pb-2">
                <Text className="text-white text-3xl font-bold text-center leading-9">
                  Welcome to the Grid
                </Text>
              </View>
              <Text className="text-slate-400 text-sm text-center font-normal">
                Sync your pass or login to access race data.
              </Text>
            </View>

            {/* Main Card */}
            <View className="py-6 w-full">
              <View className="p-1 bg-white/5 rounded-2xl border border-white/10 w-full">
                
                {/* Tab Switcher */}
                <View className="flex-row p-1 bg-black/20 rounded-xl gap-1">
                  <View className="flex-1">
                    <TouchableOpacity className="bg-red-500 rounded-lg px-4 py-3 items-center justify-center shadow-sm">
                      <Text className="text-white text-sm font-medium">Fast Ticket Sync</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <TouchableOpacity className="px-4 py-3 items-center justify-center">
                      <Text className="text-slate-400 text-sm font-medium">Account Sync</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Form Content */}
                <View className="px-5 pt-8 pb-5 gap-8">
                  <View className="gap-4">
                    <View className="relative w-full">
                      <Text className="text-slate-400 text-sm font-normal mb-1">Enter Ticket ID</Text>
                      <View className="h-12 border-b border-slate-700 w-full justify-center">
                         {/* Simulated Input Cursor/State */}
                         <View className="w-full" />
                      </View>
                      <View className="absolute right-0 top-6 p-1 rounded-md">
                        <View className="w-5 h-5 bg-red-500" />
                      </View>
                    </View>

                    <View className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 flex-row gap-3">
                      <View className="pt-0.5">
                        <View className="w-3 h-3 bg-red-500" />
                      </View>
                      <View className="flex-1 pr-2">
                        <Text className="text-red-500/80 text-xs font-normal leading-5">
                          Use the 8-digit code found on your physical pass or email confirmation.
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity className="p-4 bg-red-500 rounded-lg shadow-lg shadow-red-500/40 border border-transparent flex-row justify-center items-center relative">
                    <View className="absolute left-4">
                       <View className="w-4 h-5 bg-red-200" />
                    </View>
                    <Text className="text-white text-sm font-semibold">SYNC ACCESS</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer / Socials */}
            <View className="items-center gap-4 w-full">
              <TouchableOpacity className="flex-row items-center gap-1">
                <Text className="text-slate-400 text-sm font-normal">Need help finding your ticket?</Text>
                <View className="w-2.5 h-2.5 bg-slate-400" />
              </TouchableOpacity>

              <View className="w-full py-2 relative items-center justify-center">
                <View className="absolute w-full h-[1px] bg-slate-800" />
                <View className="bg-neutral-950 px-2">
                  <Text className="text-slate-500 text-xs font-normal uppercase tracking-wider">
                    Or continue with
                  </Text>
                </View>
              </View>

              <View className="flex-row w-full gap-3">
                <TouchableOpacity className="flex-1 py-2.5 bg-white/5 rounded-lg border border-white/5 flex-row justify-center items-center gap-2">
                  <View className="w-3 h-4 bg-white" />
                  <Text className="text-slate-300 text-sm font-medium">Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 py-2.5 bg-white/5 rounded-lg border border-white/5 flex-row justify-center items-center gap-2">
                  <View className="w-4 h-4 bg-white" />
                  <Text className="text-slate-300 text-sm font-medium">Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Badge */}
            <View className="pt-8 items-start w-full">
              <View className="w-full pt-4 pb-2 opacity-60 items-center justify-center">
                <View className="px-3 py-1.5 bg-white/5 rounded-full border border-white/5 flex-row items-center gap-2">
                  <View className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <Text className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">
                    AR Experience Ready
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
```
