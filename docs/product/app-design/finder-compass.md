# Finder Compass.

Aquest document conté el codi d'implementació de la pantalla del **Finder Compass** de l'aplicació.

## 📱 Implementació en React Native

El següent component `FindMyCarScreen` implementa la interfície d'usuari per a la pantalla del Finder Compass.

```tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, SafeAreaView, Dimensions } from 'react-native';
import { User, Navigation, Flashlight, Volume2, AlertTriangle, ChevronRight, Car } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function FindMyCarScreen() {
  return (
    <View className="flex-1 bg-neutral-950">
      <StatusBar barStyle="light-content" />
      
      {/* Background Ambience */}
      <View className="absolute top-0 left-0 w-full h-full bg-neutral-950">
         <View className="absolute top-0 left-0 w-full h-1/3 bg-zinc-900/20" />
      </View>

      <SafeAreaView className="flex-1">
        
        {/* --- HEADER --- */}
        <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1">Target Locked</Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-white/90 text-xl font-bold">Sector 4</Text>
              <Text className="text-white/50 text-xl font-normal">| Row C</Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-zinc-900/60 rounded-full border border-white/5 justify-center items-center">
            <User size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- MAIN COMPASS AREA --- */}
        <View className="flex-1 items-center justify-center relative my-4">
          
          {/* Instruction Pill */}
          <View className="absolute top-0 z-10">
            <View className="px-4 py-1.5 bg-red-500/20 rounded-full border border-red-500/20 flex-row items-center gap-2 backdrop-blur-sm">
              <View className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              <Text className="text-red-500 text-sm font-bold uppercase tracking-tight">Walk Forward</Text>
            </View>
          </View>

          {/* Compass Rings & UI */}
          <View className="w-80 h-80 justify-center items-center relative mt-8">
            {/* Outer Rings */}
            <View className="absolute w-[340px] h-[340px] border border-red-500/5 rounded-full" />
            <View className="absolute w-[280px] h-[280px] border border-red-500/10 rounded-full" />
            <View className="absolute w-[240px] h-[240px] border border-red-500/20 rounded-full" />
            
            {/* Main Dial Background */}
            <View className="w-64 h-64 bg-zinc-900/80 rounded-full border border-white/10 justify-center items-center shadow-2xl relative">
              
              {/* Cardinal Directions */}
              <Text className="absolute top-4 text-white/40 text-xs font-bold">N</Text>
              <Text className="absolute bottom-4 text-white/40 text-xs font-bold">S</Text>
              <Text className="absolute left-4 text-white/40 text-xs font-bold">W</Text>
              <Text className="absolute right-4 text-white/40 text-xs font-bold">E</Text>

              {/* Inner Decoration */}
              <View className="absolute w-56 h-56 border border-white/5 rounded-full opacity-50" />

              {/* Needle / Indicator */}
              {/* Note: Rotating the container to point NE (35deg) */}
              <View className="absolute w-full h-full justify-start items-center" style={{ transform: [{ rotate: '35deg' }] }}>
                 <View className="w-1 h-8 bg-red-500 rounded-full mt-4 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              </View>

              {/* Central Value */}
              <View className="items-center justify-center">
                <Text className="text-white text-7xl font-black leading-[80px]">125</Text>
                <Text className="text-red-500 text-sm font-bold uppercase tracking-[3px]">Meters</Text>
              </View>
            </View>
          </View>

          {/* Target Location Card (Floating below compass) */}
          <View className="absolute -bottom-6 w-full px-6 items-center">
             <View className="w-full max-w-sm p-3 bg-zinc-900 rounded-2xl border border-white/5 flex-row items-center gap-4 shadow-lg">
                <View className="w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden relative justify-center items-center">
                   <Image 
                      source={{ uri: 'https://placehold.co/64x64/333/666' }} 
                      className="absolute w-full h-full opacity-60" 
                   />
                   <View className="absolute w-full h-full bg-red-500/10" />
                   <Car size={24} color="white" />
                </View>
                
                <View className="flex-1">
                   <Text className="text-white text-base font-medium" numberOfLines={1}>Dodger Stadium Parking</Text>
                   <Text className="text-zinc-500 text-xs mt-0.5">Pinned 2h ago • Level B2</Text>
                </View>
                
                <TouchableOpacity className="w-10 h-10 justify-center items-center">
                   <ChevronRight size={20} color="#a1a1aa" />
                </TouchableOpacity>
             </View>
          </View>

        </View>

        {/* --- ACTIONS FOOTER --- */}
        <View className="px-6 pb-8 gap-6 mt-12">
          <View className="flex-row justify-between gap-3">
            
            {/* Flashlight */}
            <TouchableOpacity className="flex-1 py-4 bg-zinc-900 rounded-xl border border-white/5 items-center gap-2">
              <View className="w-10 h-10 bg-zinc-800 rounded-full justify-center items-center">
                 <Flashlight size={18} color="#d4d4d8" />
              </View>
              <Text className="text-zinc-400 text-xs font-medium">Flashlight</Text>
            </TouchableOpacity>

            {/* Honk */}
            <TouchableOpacity className="flex-1 py-4 bg-zinc-900 rounded-xl border border-white/5 items-center gap-2">
              <View className="w-10 h-10 bg-zinc-800 rounded-full justify-center items-center">
                 <Volume2 size={18} color="#d4d4d8" />
              </View>
              <Text className="text-zinc-400 text-xs font-medium">Honk</Text>
            </TouchableOpacity>

            {/* Panic */}
            <TouchableOpacity className="flex-1 py-4 bg-zinc-900 rounded-xl border border-white/5 items-center gap-2">
              <View className="w-10 h-10 bg-zinc-800 rounded-full justify-center items-center">
                 <AlertTriangle size={18} color="#d4d4d8" />
              </View>
              <Text className="text-zinc-400 text-xs font-medium">Panic</Text>
            </TouchableOpacity>

          </View>

          {/* Bottom Handle */}
          <View className="items-center opacity-30">
             <View className="w-28 h-1 bg-white rounded-full" />
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}
```