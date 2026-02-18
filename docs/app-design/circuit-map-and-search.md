# Pantalla del Mapa en el Circuit i Busqueda.

Aquest document conté el codi d'implementació de la pantalla del **Mapa en el Circuit i Busqueda** de l'aplicació.

## 📱 Implementació en React Native

El següent component `F1MapScreen` implementa la interfície d'usuari per a la pantalla del mapa en el circuit i busqueda.

```tsx
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function F1MapScreen() {
  return (
    <View className="flex-1 bg-neutral-950 relative overflow-hidden">
      <StatusBar barStyle="light-content" />

      {/* --- MAP LAYER --- */}
      <View className="absolute left-0 top-0 w-full h-full opacity-80">
        <View className="flex-1 bg-white opacity-5" />
        
        {/* Rotated Track/Map Geometry */}
        <View className="absolute left-[-144px] top-0 w-[680px] h-full justify-center items-center">
          <View className="w-96 h-[1022px] rotate-[-15deg] opacity-80 overflow-hidden" style={{ shadowColor: '#ff382e', shadowOpacity: 0.5, shadowRadius: 8 }}>
            <View className="w-96 h-[1100px] relative">
              {/* Track Outline Simulation */}
              <View className="absolute left-[156px] top-[404px] w-96 h-72 border-[11px] border-zinc-800" />
              <View className="absolute left-[156px] top-[404px] w-96 h-72 border-[3px] border-red-500" />
            </View>
          </View>
        </View>

        {/* User Location Dot */}
        <View className="absolute left-[231px] top-[478px] w-6 h-6">
          <View className="absolute w-full h-full bg-red-500 rounded-full opacity-75 animate-pulse" />
          <View className="w-full h-full bg-red-500 rounded-full border-2 border-white" />
        </View>

        {/* Marker: Grandstand A */}
        <View className="absolute left-[117px] top-[309px] items-center gap-1">
          {/* Tooltip (Hidden in original CSS "opacity-0", kept for structure or if toggled) */}
          <View className="opacity-0 px-2 py-0.5 bg-red-500 rounded mb-1">
             <Text className="text-white text-[10px] font-bold">Grandstand A</Text>
          </View>
          <View style={{ shadowColor: '#ff382e', shadowOpacity: 0.8, shadowRadius: 8 }}>
             <View className="w-5 h-6 bg-red-500" />
          </View>
        </View>

        {/* Marker: Paddock Club */}
        <View className="absolute left-[180px] top-[221px] flex-col items-center">
          <View className="px-2 py-1 bg-stone-900 rounded-md border border-red-500/30 flex-row items-center gap-1">
            <View className="w-2 h-2 bg-red-500 rounded-full" />
            <Text className="text-white text-xs font-medium">Paddock Club</Text>
          </View>
        </View>
      </View>

      {/* --- HUD LAYER --- */}
      <SafeAreaView className="flex-1">
        <View className="px-4 pt-2 gap-4">
          
          {/* Search Bar */}
          <View className="flex-row gap-3">
            <View className="flex-1 h-12 px-4 bg-neutral-900/90 rounded-full border border-white/10 flex-row items-center gap-3">
              <View className="w-4 h-4 bg-gray-400 rounded-sm" /> {/* Search Icon Placeholder */}
              <View className="flex-1">
                <Text className="text-gray-400 text-sm font-medium">Find grandstands, food...</Text>
              </View>
              <View className="w-3.5 h-5 bg-gray-400 rounded-sm" /> {/* Mic Icon Placeholder */}
            </View>
            
            {/* User Profile Button */}
            <View className="w-12 h-12 bg-neutral-900/90 rounded-full border border-white/10 justify-center items-center">
              <View className="w-5 h-5 bg-white rounded-full" />
            </View>
          </View>

          {/* Filter Chips */}
          <View className="h-11">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
              <View className="h-9 px-4 bg-neutral-900/90 rounded-full border border-white/10 flex-row items-center gap-2">
                <View className="w-3.5 h-3.5 bg-white rounded-full" />
                <Text className="text-white text-sm font-medium">Grandstands</Text>
              </View>

              <View className="h-9 px-4 bg-red-500 rounded-full flex-row items-center gap-2 shadow-lg shadow-red-500/50">
                <View className="w-3 h-3.5 bg-white rounded-sm" />
                <Text className="text-white text-sm font-medium">Food</Text>
              </View>

              <View className="h-9 px-4 bg-neutral-900/90 rounded-full border border-white/10 flex-row items-center gap-2">
                <View className="w-2.5 h-3.5 bg-white rounded-sm" />
                <Text className="text-white text-sm font-medium">Parking</Text>
              </View>

              <View className="h-9 px-4 bg-neutral-900/90 rounded-full border border-white/10 flex-row items-center gap-2">
                <View className="w-3 h-3.5 bg-white rounded-sm" />
                <Text className="text-white text-sm font-medium">Merch</Text>
              </View>
              
               <View className="h-9 px-4 bg-neutral-900/90 rounded-full border border-white/10 flex-row items-center gap-2">
                <View className="w-3 h-3.5 bg-white rounded-sm" />
                <Text className="text-white text-sm font-medium">Toilets</Text>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Floating Action Buttons (Zoom/Locate) */}
        <View className="absolute right-4 top-[500px] gap-3">
          <TouchableOpacity className="w-10 h-10 bg-neutral-900/90 rounded-full border border-white/10 justify-center items-center shadow-lg">
            <View className="w-3.5 h-4 bg-white rounded-sm" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-neutral-900/90 rounded-full border border-white/10 justify-center items-center shadow-lg">
             <View className="w-5 h-5 bg-white rounded-sm" />
          </TouchableOpacity>
        </View>

        {/* --- BOTTOM CARD: LOCATION DETAIL --- */}
        <View className="absolute bottom-[90px] w-full px-4">
          <View className="p-4 bg-neutral-900/95 rounded-2xl border border-white/10 shadow-2xl gap-4">
            
            {/* Header */}
            <View className="flex-row justify-between items-start">
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="px-1.5 py-0.5 bg-red-500/20 rounded">
                    <Text className="text-red-500 text-[10px] font-bold uppercase tracking-tight">Food Court</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <View className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <Text className="text-green-400 text-[10px] font-medium">Open Now</Text>
                  </View>
                </View>
                
                <Text className="text-white text-lg font-bold">Paddock Club Grill</Text>
                
                <View className="flex-row items-center gap-1">
                  <View className="w-2.5 h-3 bg-gray-400 rounded-sm" />
                  <Text className="text-gray-400 text-xs">5 min walk (350m)</Text>
                </View>
              </View>

              <TouchableOpacity className="w-8 h-8 bg-stone-900 rounded-full justify-center items-center">
                <View className="w-3 h-3 bg-gray-400 rounded-sm" />
              </TouchableOpacity>
            </View>

            {/* Image Gallery */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              <Image source={{ uri: 'https://placehold.co/112x80' }} className="w-28 h-20 rounded-lg border border-white/5" />
              <Image source={{ uri: 'https://placehold.co/112x80' }} className="w-28 h-20 rounded-lg border border-white/5" />
              <View className="w-20 h-20 bg-stone-900 rounded-lg border border-white/5 justify-center items-center">
                <Text className="text-gray-400 text-xs font-medium">+4 more</Text>
              </View>
            </ScrollView>

            {/* Actions */}
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 h-11 bg-red-500 rounded-lg flex-row justify-center items-center gap-2 shadow-lg shadow-red-500/30">
                <View className="w-4 h-5 bg-white rounded-sm" />
                <Text className="text-white text-sm font-medium">Navigate Here</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="w-11 h-11 bg-stone-900 rounded-lg border border-white/10 justify-center items-center">
                <View className="w-4 h-5 bg-white rounded-sm" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <View className="absolute bottom-0 w-full px-4 pt-2 pb-8 bg-stone-950 border-t border-white/5 flex-row justify-between items-center">
        <TouchableOpacity className="flex-1 items-center gap-1">
          <View className="w-4 h-4 bg-gray-500 rounded-sm" />
          <Text className="text-gray-500 text-[10px] font-medium">Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 items-center gap-1">
          <View className="w-4 h-5 bg-gray-500 rounded-sm" />
          <Text className="text-gray-500 text-[10px] font-medium">Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 items-center gap-1">
          <View className="w-4 h-4 bg-red-500 rounded-sm" />
          <Text className="text-red-500 text-[10px] font-medium">Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 items-center gap-1">
          <View className="w-4 h-4 bg-gray-500 rounded-sm" />
          <Text className="text-gray-500 text-[10px] font-medium">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```