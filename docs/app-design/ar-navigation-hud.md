# Pantalla del AR Navigation HUD.

Aquest document conté el codi d'implementació de la pantalla del **AR Navigation HUD** de l'aplicació.

## 📱 Implementació en React Native

El següent component `ARNavigationScreen` implementa la interfície d'usuari per a la pantalla del AR Navigation HUD.

```tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, Dimensions, SafeAreaView } from 'react-native';
import { Map, ArrowUp, Navigation, AlertTriangle, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function ARNavigationScreen() {
  return (
    <View className="flex-1 bg-black relative">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* --- CAMERA FEED (Simulated) --- */}
      <View className="absolute top-0 left-0 w-full h-full">
        <Image 
          source={{ uri: 'https://placehold.co/390x884' }} 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for Text Readability */}
        <View className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/80 via-transparent to-black/60" />
      </View>

      {/* --- AR OVERLAYS (Floating Elements) --- */}
      
      {/* Waypoint: 250m Ahead */}
      <View className="absolute top-[35%] left-[10%] items-center">
        <View className="bg-stone-900/70 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 flex-row items-center gap-3 shadow-lg">
          <View className="bg-red-500 rounded-full p-1.5">
             <ArrowUp size={12} color="white" />
          </View>
          <View>
            <Text className="text-white text-sm font-bold">Grandstand B</Text>
            <Text className="text-gray-300 text-xs font-medium">250m • Ahead</Text>
          </View>
        </View>
        {/* AR Line/Stem */}
        <View className="w-0.5 h-16 bg-gradient-to-b from-white to-transparent" />
        <View className="w-3 h-2.5 bg-white rounded-full opacity-80 shadow-[0_0_10px_white]" />
      </View>

      {/* Waypoint: Main Paddock (Distance) */}
      <View className="absolute top-[42%] right-[10%] items-center opacity-80">
        <View className="bg-black/60 backdrop-blur-md border border-white/5 rounded-lg px-3 py-1.5 flex-row items-center gap-2">
           <View className="p-1 bg-white/10 rounded-full">
              <View className="w-2 h-2 bg-white rounded-full" />
           </View>
           <View>
              <Text className="text-white text-xs font-bold">Main Paddock</Text>
              <Text className="text-gray-300 text-[10px]">450m</Text>
           </View>
        </View>
        <View className="w-0.5 h-9 bg-gradient-to-b from-white/50 to-transparent" />
      </View>
      
      {/* AR Path (Simulated Red Line on Floor) */}
      {/* Note: Complex 3D skewing is hard in pure RN styling, using basic shapes/opacity to mimic */}
      <View className="absolute top-[50%] left-[20%] w-[60%] h-[30%] opacity-80 pointer-events-none">
          <View className="absolute top-0 left-[20%] w-24 h-8 bg-red-500 skew-x-12 opacity-90" />
          <View className="absolute top-[80px] left-[30%] w-20 h-7 bg-red-500/60 skew-x-12" />
          <View className="absolute top-[150px] left-[40%] w-16 h-6 bg-red-500/30 skew-x-12" />
      </View>


      {/* --- HUD INTERFACE --- */}
      <SafeAreaView className="flex-1 justify-between">
        
        {/* TOP: Navigation Header */}
        <View className="px-4 pt-2 gap-4">
           
           {/* Navigation Card */}
           <View className="bg-stone-900/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex-row justify-between items-center shadow-lg">
              <View className="w-10 h-10 rounded-full bg-white/5 justify-center items-center">
                 <Navigation size={20} color="white" />
              </View>
              
              <View className="flex-1 px-4 items-center">
                 <Text className="text-red-500/90 text-xs font-bold uppercase tracking-wide mb-0.5">Navigating To</Text>
                 <Text className="text-white text-lg font-bold">Grandstand B</Text>
                 <View className="bg-white/10 px-2 py-0.5 rounded mt-1">
                    <Text className="text-gray-200 text-xs">3 min</Text>
                 </View>
              </View>

              <TouchableOpacity className="w-10 h-10 bg-red-900/40 border border-red-500/30 rounded-full justify-center items-center">
                 <X size={20} color="#fecaca" />
              </TouchableOpacity>
           </View>

           {/* Alert/Notification Pill */}
           <View className="self-center">
              <View className="bg-stone-900/80 backdrop-blur-md border-y border-l-4 border-r border-yellow-500/80 border-l-yellow-500 rounded-full px-4 py-2 flex-row items-center gap-2 shadow-md">
                 <AlertTriangle size={14} color="#eab308" />
                 <Text className="text-white text-xs font-medium">Crowd heavy near Gate 4</Text>
              </View>
           </View>

        </View>

        {/* BOTTOM: Instructions & Controls */}
        <View className="px-4 pb-8 w-full gap-4">
           
           {/* Instruction Card */}
           <View className="bg-stone-900/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex-row items-center gap-4 shadow-lg">
              {/* Mini Map Preview */}
              <View className="w-16 h-16 rounded-lg border border-white/10 overflow-hidden relative justify-center items-center bg-black/40">
                 <Image source={{ uri: 'https://placehold.co/62x62' }} className="absolute w-full h-full opacity-60" />
                 <View className="bg-black/40 p-1 rounded">
                    <Navigation size={16} color="white" style={{ transform: [{ rotate: '45deg' }]}} />
                 </View>
              </View>

              {/* Text Info */}
              <View className="flex-1">
                 <View className="flex-row items-baseline gap-1">
                    <Text className="text-white text-3xl font-bold">250</Text>
                    <Text className="text-gray-400 text-sm font-medium">meters</Text>
                 </View>
                 <Text className="text-gray-300 text-sm leading-5">Continue straight past the merch stand</Text>
              </View>

              {/* Compass/Direction Indicator */}
              <View className="w-12 h-12 rounded-full border-2 border-red-500/50 justify-center items-center relative">
                 <View className="absolute top-0 w-1 h-2 bg-red-500" />
                 <Navigation size={20} color="#ef4444" fill="#ef4444" />
              </View>
           </View>

           {/* Action Buttons */}
           <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 h-14 bg-red-600 rounded-xl flex-row justify-center items-center gap-2 shadow-lg shadow-red-900/40">
                 <Map size={20} color="white" />
                 <Text className="text-white text-base font-bold tracking-wide">Switch to 2D Map</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-14 h-14 bg-stone-900/80 backdrop-blur-md border border-white/10 rounded-xl justify-center items-center shadow-lg">
                 {/* Re-center / Locate Icon */}
                 <Navigation size={24} color="white" />
              </TouchableOpacity>
           </View>

        </View>

      </SafeAreaView>
    </View>
  );
}
```