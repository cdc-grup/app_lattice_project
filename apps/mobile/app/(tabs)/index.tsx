import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator, Dimensions, Pressable, StyleSheet } from 'react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { FilterChip } from '../../src/components/FilterChip';
import { POICard } from '../../src/components/POICard';
import { MAP_FILTERS } from '../../src/constants/mockData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../src/styles/colors';
import { usePOIs, POIGeoJSON } from '../../src/hooks/queries/usePOIs';
import { getCategoryIcon } from '../../src/utils/poiUtils';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, LinearTransition } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- HELPER COMPONENTS ---

interface POIMarkerProps {
  feature: POIGeoJSON;
  isSelected: boolean;
  onPress: (id: number) => void;
  getIcon: (category?: string) => any;
  index: number;
}

const POIMarker = React.memo(({ feature, isSelected, onPress, getIcon, index }: POIMarkerProps) => {
  const top = 35 + (index * 10) % 40;
  const left = index % 2 === 0 ? 30 + (index * 2) % 40 : 10 + (index * 5) % 80;

  return (
    <TouchableOpacity 
      onPress={() => onPress(feature.properties.id)}
      className={`absolute items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg ${
        isSelected ? 'bg-primary' : 'bg-slate-800'
      }`}
      style={{ top: `${top}%`, left: `${left}%` }}
    >
      <MaterialCommunityIcons 
        name={getIcon(feature.properties.category)} 
        size={22} 
        color="white" 
      />
    </TouchableOpacity>
  );
});

// --- STYLES ---

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  userLocationPulse: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
  },
  controlsContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  }
});

export default function MapScreen() {
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const [activeFilterId, setActiveFilterId] = useState('2'); // 'Food' active by default

  // --- MAP POSITIONING STATE ---
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  // --- DATA FETCHING ---
  const activeCategory = useMemo(() => {
    const filter = MAP_FILTERS.find(f => f.id === activeFilterId);
    return filter ? filter.category : undefined;
  }, [activeFilterId]);

  const { data: poisData, isLoading, error } = usePOIs(activeCategory);

  const selectedPoi = useMemo(() => {
    if (!selectedPoiId || !poisData) return null;
    const feature = poisData.features.find((f: POIGeoJSON) => f.properties.id === selectedPoiId);
    if (!feature) return null;
    
    return {
      id: feature.properties.id.toString(),
      name: feature.properties.name,
      description: feature.properties.description || '',
      type: feature.properties.category,
      status: 'open' as const,
      distance: '350m', 
      time: '5 min',
      images: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'
      ]
    };
  }, [selectedPoiId, poisData]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handleRecenter = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  const handleFilterPress = (id: string) => {
    setActiveFilterId(prev => prev === id ? '' : id);
  };

  return (
    <View className="flex-1 bg-black">
      {/* MAP LAYER (PANNABLE) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <Pressable 
            style={StyleSheet.absoluteFill} 
            onPress={() => setSelectedPoiId(null)} 
          />
          
          <View style={styles.userLocationPulse}>
            <View className="relative flex h-6 w-6">
              <View className="absolute h-full w-full rounded-full bg-primary opacity-40 animate-ping" />
              <View className="h-6 w-6 rounded-full bg-primary border-2 border-white" />
            </View>
          </View>

          {isLoading ? (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : (
            poisData?.features.map((feature: POIGeoJSON, index: number) => (
              <POIMarker 
                key={feature.properties.id}
                feature={feature}
                isSelected={selectedPoiId === feature.properties.id}
                onPress={setSelectedPoiId}
                getIcon={getCategoryIcon}
                index={index}
              />
            ))
          )}
        </Animated.View>
      </GestureDetector>

      {error && (
        <View className="absolute bottom-40 left-4 right-4 bg-red-500/80 p-3 rounded-lg">
          <Text className="text-white text-center font-bold">Error carregant dades</Text>
        </View>
      )}

      {/* UI LAYERS (STATIC) */}
      <View pointerEvents="box-none" style={styles.overlay}>
        <View pointerEvents="auto">
          <SearchBar />
          
          <View className="mt-4">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.filtersContainer}
            >
              {MAP_FILTERS.map(filter => (
                <FilterChip 
                  key={filter.id}
                  label={filter.label}
                  icon={filter.icon as any}
                  active={activeFilterId === filter.id}
                  onPress={() => handleFilterPress(filter.id)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="flex-1" />

        {/* Dynamic Controls & Card Container */}
        <Animated.View 
          layout={LinearTransition.duration(200)}
          pointerEvents="box-none" 
          className="pb-4"
        >
          {/* Floating Controls */}
          <View pointerEvents="auto" className="items-end px-4 mb-3 gap-3">
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
              onPress={handleRecenter}
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
          <View pointerEvents="auto">
            <POICard 
              poi={selectedPoi}
              onClose={() => setSelectedPoiId(null)}
              onNavigate={() => {}}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
