# Pantalla del Perfil i Accessibilitat.

Aquest document conté el codi d'implementació de la pantalla del **Perfil i Accessibilitat** de l'aplicació.

## 📱 Implementació en React Native

El següent component `ProfileSettingsScreen` implementa la interfície d'usuari per a la pantalla del perfil i accessibilitat.

```tsx
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { 
  ChevronLeft, 
  Settings, 
  Pen, 
  Navigation, 
  Accessibility, 
  Footprints, 
  Users, 
  Eye, 
  Ticket, 
  Bell, 
  LogOut,
  ChevronRight,
  Home,
  Calendar,
  Map as MapIcon,
  User
} from 'lucide-react-native';

export default function ProfileSettingsScreen() {
  return (
    <View className="flex-1 bg-neutral-950">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <SafeAreaView className="bg-neutral-950/80 border-b border-white/5">
        <View className="px-4 pt-2 pb-4 gap-4">
          <View className="flex-row justify-between items-center h-12">
            <TouchableOpacity className="w-10 h-10 rounded-full justify-center items-center bg-white/5">
              <ChevronLeft size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full justify-center items-center bg-white/5">
              <Settings size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <View>
            <Text className="text-white text-3xl font-bold">Profile & Settings</Text>
            <Text className="text-gray-400 text-sm mt-1">Manage your race day experience</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Profile Card */}
        <View className="p-5 relative bg-white/5 rounded-2xl border border-white/10 flex-row items-center gap-5 overflow-hidden mb-8">
          {/* Background Ambient Effect */}
          <View className="absolute right-[-40px] top-[-40px] w-32 h-32 bg-red-500/20 rounded-full blur-xl" />
          
          {/* Avatar */}
          <View className="relative">
            <View className="w-20 h-20 p-0.5 rounded-full border border-red-500/50">
              <Image 
                source={{ uri: 'https://placehold.co/76x76' }} 
                className="w-full h-full rounded-full border-2 border-neutral-950" 
              />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 w-6 h-6 bg-red-500 rounded-full border-2 border-neutral-950 justify-center items-center">
              <Pen size={10} color="white" />
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View>
            <Text className="text-white text-xl font-bold">Alex Driver</Text>
            <View className="flex-row items-center gap-2 mt-1">
              <View className="px-2 py-0.5 bg-white/10 rounded-lg border border-white/10">
                <Text className="text-white text-[10px] font-bold uppercase tracking-wide">VIP Access</Text>
              </View>
              <Text className="text-red-500 text-xs font-medium">#RD-8821</Text>
            </View>
          </View>
        </View>

        {/* Navigation Mode */}
        <View className="gap-3 mb-8">
          <View className="flex-row justify-between items-center px-1">
            <Text className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Navigation Mode</Text>
            <View className="px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
              <Text className="text-red-500 text-xs">Active</Text>
            </View>
          </View>

          <View className="p-1.5 bg-white/5 rounded-2xl border border-white/10 flex-row">
            <TouchableOpacity className="flex-1 py-3 bg-red-500 rounded-xl justify-center items-center shadow-lg shadow-red-500/20 gap-1">
               <Navigation size={18} color="white" />
               <Text className="text-white text-xs font-medium">Standard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 py-3 justify-center items-center gap-1">
               <Accessibility size={20} color="#9ca3af" />
               <Text className="text-gray-400 text-xs font-medium">Wheelchair</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="px-1 text-gray-500 text-xs">Optimizes AR routes for ramps, elevators, and wide paths.</Text>
        </View>

        {/* Route Preferences */}
        <View className="gap-3 mb-8">
          <Text className="px-1 text-gray-400 text-sm font-semibold uppercase tracking-wider">Route Preferences</Text>

          {/* Item 1 */}
          <View className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-white/5 rounded-xl justify-center items-center">
                <Footprints size={18} color="#ef4444" />
              </View>
              <View>
                <Text className="text-white text-base font-medium">Avoid Stairs</Text>
                <Text className="text-gray-400 text-xs">Prioritize elevators</Text>
              </View>
            </View>
            {/* Toggle Off */}
            <View className="w-12 h-6 bg-gray-800 rounded-full justify-center px-0.5">
               <View className="w-5 h-5 bg-white rounded-full" />
            </View>
          </View>

          {/* Item 2 */}
          <View className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-white/5 rounded-xl justify-center items-center">
                <Users size={18} color="#ef4444" />
              </View>
              <View>
                <Text className="text-white text-base font-medium">Avoid Crowds</Text>
                <Text className="text-gray-400 text-xs">Low density routes</Text>
              </View>
            </View>
            {/* Toggle Off */}
            <View className="w-12 h-6 bg-gray-800 rounded-full justify-center px-0.5">
               <View className="w-5 h-5 bg-white rounded-full" />
            </View>
          </View>

          {/* Item 3 */}
          <View className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-white/5 rounded-xl justify-center items-center">
                <Eye size={18} color="#ef4444" />
              </View>
              <View>
                <Text className="text-white text-base font-medium">High Contrast AR</Text>
                <Text className="text-gray-400 text-xs">Enhanced visibility</Text>
              </View>
            </View>
            {/* Toggle On */}
            <View className="w-12 h-6 bg-red-500 rounded-full justify-center items-end px-0.5">
               <View className="w-5 h-5 bg-white rounded-full shadow-sm items-center justify-center">
                  <View className="w-3 h-2 bg-red-500 rounded-full" />
               </View>
            </View>
          </View>
        </View>

        {/* Menu Links */}
        <View className="gap-2">
          <TouchableOpacity className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <Ticket size={20} color="#d1d5db" />
              <Text className="text-gray-300 text-sm font-medium">Ticket Wallet</Text>
            </View>
            <ChevronRight size={16} color="#6b7280" />
          </TouchableOpacity>
          
          <TouchableOpacity className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <Bell size={20} color="#d1d5db" />
              <Text className="text-gray-300 text-sm font-medium">Notifications</Text>
            </View>
            <ChevronRight size={16} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 rounded-2xl flex-row justify-center items-center mt-2">
            <LogOut size={18} color="#9ca3af" className="mr-2" />
            <Text className="text-gray-400 text-sm font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-4 pt-2 pb-8 bg-stone-950 border-t border-white/5 flex-row justify-between items-center">
        <TouchableOpacity className="flex-1 items-center gap-1">
          <Home size={20} color="#6b7280" />
          <Text className="text-gray-500 text-[10px] font-medium">Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 items-center gap-1">
          <Calendar size={20} color="#6b7280" />
          <Text className="text-gray-500 text-[10px] font-medium">Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 items-center gap-1">
          <MapIcon size={20} color="#6b7280" />
          <Text className="text-gray-500 text-[10px] font-medium">Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 items-center gap-1">
          <User size={20} color="#ef4444" />
          <Text className="text-red-500 text-[10px] font-medium">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```