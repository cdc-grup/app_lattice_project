import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { FilterChip } from '../../src/components/FilterChip';
import { POICard } from '../../src/components/POICard';
import { colors } from '../../src/styles/colors';
import { usePOIs, POIGeoJSON } from '../../src/hooks/queries/usePOIs';
import { useCategories } from '../../src/hooks/queries/useCategories';
import { getCategoryIcon } from '../../src/utils/poiUtils';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useLocationService } from '../../src/hooks/useLocationService';
import { Feather } from '@expo/vector-icons';
import { useMapControls } from '../../src/hooks/useMapControls';

// Configure MapLibre
MapLibreGL.setAccessToken(null);
// Filter out noisy location errors common in emulators
MapLibreGL.Logger.setLogCallback((log) => {
  const msg = typeof log.message === 'string' ? log.message : '';
  if (
    msg.includes('Failed to obtain last location update') ||
    msg.includes('Last location unavailable')
  ) {
    return true;
  }
  return false;
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
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  // Custom hooks for logic extraction
  const { coords: userCoords, status: locationStatus, requestPermission } = useLocationService();
  const { camera, followUser, setFollowUser, handleRecenter } = useMapControls(
    userCoords,
    requestPermission
  );

  const { data: categories } = useCategories();

  // --- DATA FETCHING ---
  const activeCategory = useMemo(() => {
    if (!activeFilterId || !categories) return undefined;
    const filter = categories.find((f) => f.id === activeFilterId);
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
      description: feature.properties.description,
      type: feature.properties.category,
      crowdLevel: feature.properties.crowdLevel,
      isWheelchairAccessible: feature.properties.isWheelchairAccessible,
      hasPriorityLane: feature.properties.hasPriorityLane,
      // For now, we don't have images/distance in DB yet
      images: [],
      distance: '350m',
      time: '5 min',
    };
  }, [selectedPoiId, poisData]);

  const handleFilterPress = useCallback((id: string) => {
    setActiveFilterId((prev) => (prev === id ? '' : id));
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
          compassEnabled={false}
          rotateEnabled={false}
          onPress={() => setSelectedPoiId(null)}
          onRegionWillChange={() => {
            if (followUser) setFollowUser(false);
          }}
        >
          <MapLibreGL.Camera
            ref={camera}
            followUserLocation={followUser && locationStatus === 'granted'}
            followUserMode={MapLibreGL.UserTrackingMode.Follow}
            centerCoordinate={!followUser && userCoords ? userCoords : undefined}
            minZoomLevel={14.5}
            maxBounds={{
              ne: [2.142, 41.413], // ~3km NE from center
              sw: [2.07, 41.359], // ~3km SW from center
            }}
            defaultSettings={{
              centerCoordinate: [2.1060698, 41.3863034], // Institut Pedralbes (Testing)
              zoomLevel: 19,
            }}
          />

          {locationStatus === 'granted' && (
            <>
              <MapLibreGL.UserLocation
                visible={true}
                renderMode="normal"
                showsUserHeadingIndicator={false}
              />
              {userCoords && (
                <MapLibreGL.ShapeSource
                  id="user-location-backup"
                  shape={{
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: userCoords,
                    },
                    properties: {},
                  }}
                >
                  <MapLibreGL.CircleLayer
                    id="user-location-backup-outer"
                    style={{
                      circleRadius: 12,
                      circleColor: colors.primary,
                      circleOpacity: 0.4,
                    }}
                  />
                  <MapLibreGL.CircleLayer
                    id="user-location-backup-inner"
                    style={{
                      circleRadius: 7,
                      circleColor: colors.primary,
                      circleStrokeWidth: 2.5,
                      circleStrokeColor: 'white',
                    }}
                  />
                </MapLibreGL.ShapeSource>
              )}
            </>
          )}

          {poisData && (
            <MapLibreGL.ShapeSource
              id="pois-source"
              shape={poisData}
              onPress={(e) => {
                const feature = e.features[0];
                if (feature && feature.properties) {
                  setSelectedPoiId(feature.properties.id);
                }
              }}
            >
              {/* Outer Glow / Ring for all markers */}
              <MapLibreGL.CircleLayer
                id="poi-outer-ring"
                style={{
                  circleRadius: 18,
                  circleColor: 'white',
                  circleOpacity: 0.1,
                  circleStrokeWidth: 1,
                  circleStrokeColor: 'rgba(255,255,255,0.2)',
                }}
              />

              {/* Selection Highlight */}
              <MapLibreGL.CircleLayer
                id="poi-selection-highlight"
                filter={['==', ['get', 'id'], selectedPoiId || -1]}
                style={{
                  circleRadius: 22,
                  circleColor: colors.primary,
                  circleOpacity: 0.3,
                  circleBlur: 0.5,
                }}
              />

              {/* Main Background Circle */}
              <MapLibreGL.CircleLayer
                id="poi-bg"
                style={{
                  circleRadius: 16,
                  circleColor: [
                    'case',
                    ['==', ['get', 'id'], selectedPoiId || -1],
                    colors.primary,
                    '#1e293b', // slate-800
                  ],
                  circleStrokeWidth: 2,
                  circleStrokeColor: 'white',
                }}
              />

              {/* Symbol Layer for Labels or Icons (future-proof) */}
              <MapLibreGL.SymbolLayer
                id="poi-labels"
                style={{
                  textField: ['get', 'name'],
                  textColor: 'white',
                  textSize: 12,
                  textOffset: [0, 2.5],
                  textAnchor: 'top',
                  textOpacity: [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    16,
                    0,
                    17,
                    1,
                  ],
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
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
              {categories?.map((filter) => (
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
              <Feather name="layers" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRecenter}
              className="w-10 h-10 items-center justify-center rounded-full border border-transparent"
              style={{
                backgroundColor: 'rgba(24, 24, 27, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Feather name="navigation" size={20} color="white" />
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
