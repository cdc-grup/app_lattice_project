# Detall de Servei i Línia de Espera.

Aquest document conté el codi d'implementació de la pantalla del **Detall de Servei i Línia de Espera** de l'aplicació.

## 📱 Implementació en React Native

El següent component `ServiceDetailScreen` implementa la interfície d'usuari per a la pantalla del detall de servei i línia de espera.

```tsx
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, SafeAreaView } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function VenueDetailScreen() {
  return (
    <View className="flex-1 bg-stone-900 relative">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* --- BACKGROUND IMAGE LAYER --- */}
      <View className="absolute top-0 left-0 w-full h-[50%] bg-neutral-900">
        <Image 
          source={{ uri: 'https://placehold.co/800x800/222/555' }} 
          className="w-full h-full opacity-60"
          resizeMode="cover"
        />
        {/* Gradient Overlay */}
        <View className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-stone-900/90" />
      </View>

      {/* --- HEADER ACTIONS --- */}
      <SafeAreaView className="absolute top-0 w-full z-10">
        <View className="px-4 pt-2 flex-row justify-between items-center">
          <TouchableOpacity className="w-10 h-10 bg-stone-900/80 rounded-full border border-white/10 justify-center items-center shadow-lg">
             {/* Back Icon Placeholder */}
             <View className="w-4 h-4 bg-white rounded-sm" />
          </TouchableOpacity>
          
          <TouchableOpacity className="w-10 h-10 bg-stone-900/80 rounded-full border border-white/10 justify-center items-center shadow-lg">
             {/* Share/More Icon Placeholder */}
             <View className="w-4 h-5 bg-white rounded-sm" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* --- BOTTOM SHEET / CONTENT --- */}
      <View className="flex-1 justify-end">
        <View className="h-[80%] bg-stone-900/95 rounded-t-3xl border-t border-white/10 shadow-2xl overflow-hidden relative">
            {/* Drag Handle */}
            <View className="w-full items-center pt-3 pb-2 bg-stone-900/95">
              <View className="w-12 h-1.5 bg-white/20 rounded-full" />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
              
              {/* Header Info */}
              <View className="px-6 pt-2 pb-6 gap-1">
                <View className="flex-row items-center flex-wrap gap-2">
                  <View className="px-2 py-0.5 bg-red-500/20 rounded border border-red-500/20">
                    <Text className="text-red-500 text-xs font-semibold uppercase tracking-wide">Sector 4</Text>
                  </View>
                  <Text className="text-white/50 text-xs">•</Text>
                  <Text className="text-white/60 text-xs font-medium">Food & Drink</Text>
                  <Text className="text-white/50 text-xs">•</Text>
                  <View className="flex-row items-center gap-1">
                    <View className="w-2.5 h-2.5 bg-white/60 rounded-full" />
                    <Text className="text-white/60 text-xs">50m</Text>
                  </View>
                </View>

                <Text className="text-white text-3xl font-bold mt-1">Gridiron Grill</Text>
              </View>

              {/* Live Status Card */}
              <View className="px-6 pb-6">
                <View className="p-4 bg-stone-900/50 rounded-xl border border-white/5 gap-4">
                  
                  {/* Status Header */}
                  <View className="flex-row justify-between items-end">
                    <View className="flex-row items-center gap-2">
                       <View className="w-4 h-2 bg-red-500 rounded-sm" />
                       <Text className="text-white/90 text-sm font-medium">Crowd Density</Text>
                    </View>
                    <View className="items-end">
                      <View className="flex-row items-baseline gap-1">
                        <Text className="text-red-500 text-2xl font-bold">12</Text>
                        <Text className="text-white/60 text-sm">min</Text>
                      </View>
                      <Text className="text-white/40 text-[10px] font-medium uppercase tracking-wide">Est. Wait</Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-3 bg-white/10 rounded-full overflow-hidden relative">
                    <View className="absolute left-0 top-0 h-full w-[70%] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                    {/* Tick Marks */}
                    <View className="flex-row justify-between w-full px-0.5 h-full">
                       <View className="w-px h-full bg-stone-900/30" />
                       <View className="w-px h-full bg-stone-900/30" />
                       <View className="w-px h-full bg-stone-900/30" />
                       <View className="w-px h-full bg-stone-900/30" />
                    </View>
                  </View>

                  {/* Range Labels */}
                  <View className="flex-row justify-between">
                    <Text className="text-white/40 text-[10px] font-medium uppercase">Low</Text>
                    <Text className="text-red-500 text-[10px] font-medium uppercase">High Traffic</Text>
                  </View>
                </View>
              </View>

              {/* Menu Carousel */}
              <View className="pl-6 gap-3 mb-6">
                <Text className="text-white/80 text-sm font-semibold uppercase tracking-wide">Top Menu Items</Text>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 24 }}>
                  
                  {/* Item 1 */}
                  <View className="w-40 h-48 bg-white/5 rounded-lg border border-white/5 p-3">
                    <View className="w-full h-24 bg-gray-800 rounded mb-2 overflow-hidden relative">
                       <Image source={{ uri: 'https://placehold.co/150x150' }} className="w-full h-full" />
                       <View className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded backdrop-blur-sm">
                          <Text className="text-white text-[10px] font-mono">$12.00</Text>
                       </View>
                    </View>
                    <Text className="text-white text-sm font-medium mb-1">Pit Stop Burger</Text>
                    <Text className="text-white/50 text-xs leading-4">Double beef, spicy mayo, brioche bun.</Text>
                  </View>

                  {/* Item 2 */}
                  <View className="w-40 h-48 bg-white/5 rounded-lg border border-white/5 p-3">
                    <View className="w-full h-24 bg-gray-800 rounded mb-2 overflow-hidden relative">
                       <Image source={{ uri: 'https://placehold.co/150x150' }} className="w-full h-full" />
                       <View className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded backdrop-blur-sm">
                          <Text className="text-white text-[10px] font-mono">$6.50</Text>
                       </View>
                    </View>
                    <Text className="text-white text-sm font-medium mb-1">Turbo Fries</Text>
                    <Text className="text-white/50 text-xs leading-4">Seasoned waffle fries with garlic dip.</Text>
                  </View>

                  {/* Item 3 */}
                   <View className="w-40 h-48 bg-white/5 rounded-lg border border-white/5 p-3">
                    <View className="w-full h-24 bg-gray-800 rounded mb-2 overflow-hidden relative">
                       <Image source={{ uri: 'https://placehold.co/150x150' }} className="w-full h-full" />
                       <View className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded backdrop-blur-sm">
                          <Text className="text-white text-[10px] font-mono">$4.00</Text>
                       </View>
                    </View>
                    <Text className="text-white text-sm font-medium mb-1">Nitro Cola</Text>
                    <Text className="text-white/50 text-xs leading-4">High caffeine cola, extra ice.</Text>
                  </View>

                </ScrollView>
              </View>

              {/* Vendor Details */}
              <View className="px-6 gap-3 mb-24">
                 <Text className="text-white/80 text-sm font-semibold uppercase tracking-wide">Vendor Details</Text>
                 
                 <TouchableOpacity className="p-3 bg-white/5 rounded-lg border border-white/5 flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-red-500/10 rounded-full justify-center items-center">
                         <View className="w-3.5 h-3.5 bg-red-500 rounded-sm" />
                      </View>
                      <Text className="text-white/90 text-sm">Allergen Info</Text>
                    </View>
                    <View className="w-1.5 h-2 bg-white/40" /> {/* Chevron */}
                 </TouchableOpacity>

                 <TouchableOpacity className="p-3 bg-white/5 rounded-lg border border-white/5 flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-red-500/10 rounded-full justify-center items-center">
                         <View className="w-3.5 h-3.5 bg-red-500 rounded-sm" />
                      </View>
                      <Text className="text-white/90 text-sm">Reviews (4.8/5)</Text>
                    </View>
                    <View className="w-1.5 h-2 bg-white/40" /> {/* Chevron */}
                 </TouchableOpacity>
              </View>

            </ScrollView>

            {/* Floating CTA Button (Pinned to bottom of sheet) */}
            <View className="absolute bottom-0 w-full px-6 pt-4 pb-8 bg-gradient-to-t from-stone-900 via-stone-900 to-transparent">
               <TouchableOpacity className="w-full h-12 bg-red-500 rounded-lg shadow-lg shadow-red-500/40 flex-row justify-center items-center gap-2">
                  <View className="w-3.5 h-4 bg-white rounded-sm" />
                  <Text className="text-white text-base font-bold">Start Mobile Order</Text>
               </TouchableOpacity>
            </View>

        </View>
      </View>
    </View>
  );
}
```