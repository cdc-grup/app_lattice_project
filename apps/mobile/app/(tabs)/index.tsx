import React, { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { FilterChip } from '../../src/components/FilterChip';
import { POICard } from '../../src/components/POICard';
import { MOCK_POIS, MAP_FILTERS } from '../../src/constants/mockData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../src/styles/colors';

export default function MapScreen() {
  const [selectedPoi, setSelectedPoi] = useState<typeof MOCK_POIS[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState('2'); // 'Food' active by default to match design

  return (
    <View className="flex-1 bg-[#0A0A0B]">
      {/* Background Map Mock */}
      <View className="absolute inset-0">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200' }}
          className="w-full h-full opacity-40 grayscale"
          resizeMode="cover"
        />
        {/* Mock Marker representing user or selection */}
        <View className="absolute top-1/2 left-1/2 -ml-3 -mt-3">
          <View className="relative flex h-6 w-6">
            <View className="absolute h-full w-full rounded-full bg-primary opacity-40 animate-ping" />
            <View className="h-6 w-6 rounded-full bg-primary border-2 border-white" />
          </View>
        </View>

        {/* Example POI Marker */}
        <TouchableOpacity 
          onPress={() => setSelectedPoi(MOCK_POIS[0])}
          className="absolute top-[35%] left-[30%] items-center"
        >
          <MaterialCommunityIcons name="map-marker" size={32} color={colors.primary} />
          <View className="bg-primary px-2 py-0.5 rounded shadow-lg mt-1">
            <Text className="text-white text-[10px] font-bold">Paddock Club</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* UI Layers */}
      <View className="flex-1">
        <SearchBar />
        
        <View className="mt-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {MAP_FILTERS.map(filter => (
              <FilterChip 
                key={filter.id}
                label={filter.label}
                icon={filter.icon as any}
                active={activeFilter === filter.id}
                onPress={() => setActiveFilter(filter.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View className="flex-1" />

        {/* Floating Controls */}
        <View className="absolute right-4 bottom-32 gap-3">
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full border border-transparent"
            style={{
              backgroundColor: 'rgba(24, 24, 27, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <MaterialCommunityIcons name="layers-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full border border-transparent"
            style={{
              backgroundColor: 'rgba(24, 24, 27, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Selected POI Card */}
        <POICard 
          poi={selectedPoi}
          onClose={() => setSelectedPoi(null)}
          onNavigate={() => {}}
        />
      </View>
    </View>
  );
}
