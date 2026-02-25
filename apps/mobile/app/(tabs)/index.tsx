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
import { getCategoryIcon, getCategoryColor } from '../../src/utils/poiUtils';
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
  const { camera, followUser, setFollowUser, centerOnUser, centerOnPOI } = useMapControls(
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

  // --- PERFORMANCE OPTIMIZED DATA ---
  const poisGeoJSON = useMemo(() => poisData, [poisData]);

  const userLocationGeoJSON = useMemo(() => {
    if (!userCoords) return null;
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: userCoords,
      },
      properties: {},
    };
  }, [userCoords]);

  const selectedFeature = useMemo(() => {
    if (!selectedPoiId || !poisData) return null;
    return poisData.features.find((f: POIGeoJSON) => f.properties.id === selectedPoiId);
  }, [selectedPoiId, poisData]);

  const selectedPoi = useMemo(() => {
    if (!selectedFeature) return null;

    return {
      id: selectedFeature.properties.id.toString(),
      name: selectedFeature.properties.name,
      description: selectedFeature.properties.description,
      type: selectedFeature.properties.category,
      crowdLevel: selectedFeature.properties.crowdLevel,
      isWheelchairAccessible: selectedFeature.properties.isWheelchairAccessible,
      hasPriorityLane: selectedFeature.properties.hasPriorityLane,
      images: [],
      distance: '350m',
      time: '5 min',
    };
  }, [selectedFeature]);

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
            minZoomLevel={14.5}
            maxBounds={{
              ne: [2.142, 41.413],
              sw: [2.07, 41.359],
            }}
            defaultSettings={{
              centerCoordinate: [2.1060698, 41.3863034],
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
              {userLocationGeoJSON && (
                <MapLibreGL.ShapeSource
                  id="user-location-backup"
                  shape={userLocationGeoJSON}
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

          {/* DATA DRIVEN MARKERS WITH PERFORMANCE GAINS */}
          {poisGeoJSON && (
            <MapLibreGL.ShapeSource
              id="pois-source"
              shape={poisGeoJSON}
              onPress={(event) => {
                const feature = event.features[0];
                if (feature && feature.properties) {
                  const id = feature.properties.id;
                  setSelectedPoiId(id);
                  if (feature.geometry.type === 'Point') {
                    centerOnPOI(feature.geometry.coordinates);
                  }
                }
              }}
            >
              {/* Unselected POIs - Background Circle */}
              <MapLibreGL.CircleLayer
                id="poi-circles"
                filter={['!=', ['get', 'id'], selectedPoiId || -1]}
                style={{
                  circleRadius: 10,
                  circleColor: colors.slate[700],
                  circleStrokeWidth: 2,
                  circleStrokeColor: 'white',
                  circleOpacity: 0.8,
                }}
              />

              {/* Unselected POIs - Labels */}
              <MapLibreGL.SymbolLayer
                id="poi-labels"
                filter={['!=', ['get', 'id'], selectedPoiId || -1]}
                style={{
                  textField: ['get', 'name'],
                  textSize: 10,
                  textColor: 'white',
                  textOffset: [0, 1.5],
                  textAnchor: 'top',
                  textHaloColor: 'rgba(0,0,0,0.8)',
                  textHaloWidth: 1,
                }}
              />
            </MapLibreGL.ShapeSource>
          )}

          {/* HIGH-DETAIL SELECTED MARKER */}
          {selectedFeature && (
            <MapLibreGL.MarkerView
              key={`selected-poi-${selectedFeature.properties.id}`}
              id={`selected-marker-${selectedFeature.properties.id}`}
              coordinate={selectedFeature.geometry.coordinates}
            >
              <View className="items-center">
                <View 
                  style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: 18, 
                    backgroundColor: colors.primary,
                    borderWidth: 2,
                    borderColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 10,
                  }}
                >
                  <Feather name={getCategoryIcon(selectedFeature.properties.category) as any} size={18} color="white" />
                </View>
                <Text 
                  className="text-white text-[12px] font-bold mt-1 text-center"
                  style={{ 
                    textShadowColor: 'rgba(0, 0, 0, 0.8)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4
                  }}
                >
                  {selectedFeature.properties.name}
                </Text>
              </View>
            </MapLibreGL.MarkerView>
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

        {/* UI Controls Container */}
        <Animated.View
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
              onPress={centerOnUser}
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
