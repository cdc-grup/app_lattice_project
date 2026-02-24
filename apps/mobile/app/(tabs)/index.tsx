import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator, Dimensions, Pressable, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { FilterChip } from '../../src/components/FilterChip';
import { POICard } from '../../src/components/POICard';
import { colors } from '../../src/styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePOIs, POIGeoJSON } from '../../src/hooks/queries/usePOIs';
import { useCategories } from '../../src/hooks/queries/useCategories';
import { getCategoryIcon } from '../../src/utils/poiUtils';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useLocationPermission } from '../../src/hooks/useLocationPermission';

// Configure MapLibre
MapLibreGL.setAccessToken(null);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- HELPER COMPONENTS ---

interface POIMarkerProps {
  feature: POIGeoJSON;
  isSelected: boolean;
  onPress: (id: number) => void;
  getIcon: (category?: string) => any;
}

const POIMarker = React.memo(({ feature, isSelected, onPress, getIcon }: POIMarkerProps) => {
  return (
    <MapLibreGL.MarkerView coordinate={feature.geometry.coordinates}>
      <TouchableOpacity 
        onPress={() => onPress(feature.properties.id)}
        className={`items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg ${
          isSelected ? 'bg-primary' : 'bg-slate-800'
        }`}
      >
        <MaterialCommunityIcons 
          name={getIcon(feature.properties.category)} 
          size={22} 
          color="white" 
        />
      </TouchableOpacity>
    </MapLibreGL.MarkerView>
  );
});

// --- STYLES ---

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  map: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
});

export default function MapScreen() {
  const camera = React.useRef<MapLibreGL.CameraRef>(null);
  const [followUser, setFollowUser] = useState(false);
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const { status: locationStatus, requestPermission } = useLocationPermission();
  const { data: categories } = useCategories();

  // --- DATA FETCHING ---
  const activeCategory = useMemo(() => {
    if (!activeFilterId || !categories) return undefined;
    const filter = categories.find(f => f.id === activeFilterId);
    return filter ? filter.category : undefined;
  }, [activeFilterId, categories]);

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

  const handleRecenter = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      setFollowUser(true);
    }
  }, [requestPermission]);

  const handleFilterPress = useCallback((id: string) => {
    setActiveFilterId(prev => prev === id ? '' : id);
  }, []);

  return (
    <View className="flex-1 bg-black">
      {/* REAL MAP LAYER */}
      <View style={styles.mapContainer}>
        <MapLibreGL.MapView
          style={styles.map}
          mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          logoEnabled={false}
          attributionEnabled={false}
          onPress={() => setSelectedPoiId(null)}
          onRegionWillChange={() => {
            if (followUser) setFollowUser(false);
          }}
          surfaceView={true}
        >
          <MapLibreGL.Camera
            ref={camera}
            followUserLocation={followUser}
            followUserMode={MapLibreGL.UserTrackingMode.FollowWithHeading}
            minZoomLevel={10}
            maxBounds={{
              ne: [2.404, 41.611],
              sw: [1.808, 41.161],
            }}
            defaultSettings={{
              centerCoordinate: [2.1060698, 41.3863034], // Institut Pedralbes (Testing)
              zoomLevel: 19,
            }}
          />

          {/* Floor Plan Overlay */}
          <MapLibreGL.ImageSource
            id="pedralbes-floorplan"
            coordinates={[
              [2.1052698, 41.3869034], // Top Left
              [2.1068698, 41.3869034], // Top Right
              [2.1068698, 41.3857034], // Bottom Right
              [2.1052698, 41.3857034], // Bottom Left
            ]}
            url={require('../../assets/background_institutpedralbes.png')}
          >
            <MapLibreGL.RasterLayer
              id="pedralbes-floorplan-layer"
              style={{
                rasterOpacity: 1, // Full opacity as requested (only lines)
              }}
            />
          </MapLibreGL.ImageSource>

          <MapLibreGL.UserLocation 
            visible={true}
            renderMode="native"
            showsUserHeadingIndicator={true}
          />
          
          {poisData?.features.map((feature: POIGeoJSON) => (
            <POIMarker 
              key={feature.properties.id}
              feature={feature}
              isSelected={selectedPoiId === feature.properties.id}
              onPress={setSelectedPoiId}
              getIcon={getCategoryIcon}
            />
          ))}
        </MapLibreGL.MapView>

        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}
      </View>

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
              {categories?.map(filter => (
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
