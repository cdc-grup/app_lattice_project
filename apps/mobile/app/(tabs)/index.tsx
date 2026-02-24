import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { FilterChip } from '../../src/components/FilterChip';
import { POICard } from '../../src/components/POICard';
import { MAP_FILTERS } from '../../src/constants/mockData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../src/styles/colors';
import { usePOIs } from '../../src/hooks/queries/usePOIs';

export default function MapScreen() {
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const [activeFilterId, setActiveFilterId] = useState('2'); // 'Food' active by default

  // Map filter ID to backend category string
  const activeCategory = useMemo(() => {
    const filter = MAP_FILTERS.find(f => f.id === activeFilterId);
    return filter ? filter.label.toLowerCase() : undefined;
  }, [activeFilterId]);

  const { data: poisData, isLoading, error } = usePOIs(activeCategory);

  const selectedPoi = useMemo(() => {
    if (!selectedPoiId || !poisData) return null;
    const feature = poisData.features.find(feature => feature.properties.id === selectedPoiId);
    if (!feature) return null;
    
    // Transform GeoJSON feature to match POICard expected format
    return {
      id: feature.properties.id.toString(),
      name: feature.properties.name,
      description: feature.properties.description || '',
      type: feature.properties.category,
      status: 'open' as const, // Mocked for now as per POICard requirements
      distance: '350m', // Mocked
      time: '5 min', // Mocked
      images: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'
      ]
    };
  }, [selectedPoiId, poisData]);

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Background is now a solid gray */}
      
      {/* User Location Marker */}
      <View className="absolute top-1/2 left-1/2 -ml-3 -mt-3">
        <View className="relative flex h-6 w-6">
          <View className="absolute h-full w-full rounded-full bg-primary opacity-40 animate-ping" />
          <View className="h-6 w-6 rounded-full bg-primary border-2 border-white" />
        </View>
      </View>

      {/* Dynamic POI Markers from Backend */}
      {isLoading ? (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        poisData?.features.map((feature, index) => {
          const top = 35 + (index * 10) % 40;
          const left = 30 + (index * 15) % 50;

          return (
            <TouchableOpacity 
              key={feature.properties.id}
              onPress={() => setSelectedPoiId(feature.properties.id)}
              className="absolute items-center"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <MaterialCommunityIcons name="map-marker" size={32} color={colors.primary} />
              <View className="bg-primary px-2 py-0.5 rounded shadow-lg mt-1">
                <Text className="text-white text-[10px] font-bold">{feature.properties.name}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {error && (
        <View className="absolute bottom-40 left-4 right-4 bg-red-500/80 p-3 rounded-lg">
          <Text className="text-white text-center font-bold">Error carregant dades</Text>
        </View>
      )}

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
                active={activeFilterId === filter.id}
                onPress={() => setActiveFilterId(filter.id)}
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
          onClose={() => setSelectedPoiId(null)}
          onNavigate={() => {}}
        />
      </View>
    </View>
  );
}
