import React, { useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { FilterChip } from '../../src/components/FilterChip';
import { POICard } from '../../src/components/POICard';
import { colors } from '../../src/styles/colors';
import { usePOIs } from '../../src/hooks/queries/usePOIs';
import { useCategories } from '../../src/hooks/queries/useCategories';
import Animated from 'react-native-reanimated';
import { useLocationService } from '../../src/hooks/useLocationService';
import { useCameraTilt } from '../../src/hooks/useCameraTilt';
import { AROverlay } from '../../src/components/ar/AROverlay';
import { Feather } from '@expo/vector-icons';
import { useMapStore } from '../../src/store/useMapStore';
import { MapContent } from '../../src/components/map/MapContent';
import { DIRECT_ACCESS_CATEGORIES } from '../../src/utils/poiUtils';

// Configure MapLibre
MapLibreGL.setAccessToken(null);
MapLibreGL.Logger.setLogCallback((log) => {
  const msg = typeof log.message === 'string' ? log.message : '';
  if (msg.includes('Failed to obtain last location update') || msg.includes('Last location unavailable')) return true;
  return false;
});

const styles = StyleSheet.create({
  mapContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  map: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },
  filtersContainer: { paddingHorizontal: 16 },
});

function MapIndex() {
  const { coords: userCoords, status: locationStatus, requestPermission } = useLocationService();
  const { selectedPoiId, deselect, triggerRecenter, selectPoi } = useMapStore();
  const { data: categories } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);

  const { isVisible: isARVisible } = useCameraTilt();

  const activeCategory = useMemo(() => {
    return categories?.find(c => c.id === activeCategoryId)?.category;
  }, [activeCategoryId, categories]);

  const { data: poisData, isLoading } = usePOIs(activeCategory);

  const selectedPoi = useMemo(() => {
    if (!selectedPoiId || !poisData) return null;
    const f = poisData.features.find((f: any) => f.properties.id === selectedPoiId);
    if (!f) return null;
    return {
      ...f.properties,
      geometry: f.geometry,
      distance: '350m',
      time: '5 min'
    };
  }, [selectedPoiId, poisData]);

  const handleRecenter = useCallback(async () => {
    await requestPermission();
    triggerRecenter();
  }, [requestPermission, triggerRecenter]);


  return (
    <View className="flex-1 bg-black">
      <View style={styles.mapContainer}>
        <MapContent 
          userCoords={userCoords}
          locationStatus={locationStatus}
          poisGeoJSON={poisData}
        />
        <AROverlay 
          isVisible={isARVisible} 
          onExitAR={() => {
            // In a production app, we would use ScreenOrientation to lock back to portrait
            // or update a state that overrides the sensor-based activation.
            console.log('User requested AR exit');
          }}
        />
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}
      </View>

      <View pointerEvents="box-none" style={styles.overlay}>
        <View pointerEvents="auto">
          <SearchBar />
          <View className="mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
              {categories?.map((cat) => (
                <FilterChip
                  key={cat.id}
                  label={cat.label}
                  icon={cat.icon as any}
                  active={activeCategoryId === cat.id}
                  onPress={() => {
                    if (DIRECT_ACCESS_CATEGORIES.includes(cat.category)) {
                      // Direct Access: Find and select immediately, don't filter
                      const poi = poisData?.features.find((f: any) => f.properties.category === cat.category);
                      if (poi) {
                        selectPoi(poi.properties.id, poi.geometry.coordinates);
                      }
                    } else {
                      // Filter: Toggle and deselect existing items
                      setActiveCategoryId(prev => prev === cat.id ? null : cat.id);
                      deselect();
                    }
                  }}
                />
              ))}
            </ScrollView>
          </View>
        </View>


        <View className="flex-1" />

        <Animated.View pointerEvents="box-none" className="pb-4">
          <View pointerEvents="auto" className="items-end px-4 mb-3 gap-3">
            <Pressable 
              onPress={handleRecenter}
              className="w-10 h-10 items-center justify-center rounded-full active:opacity-70" 
              style={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Feather name="navigation" size={20} color="white" />
            </Pressable>
          </View>

          <View pointerEvents="auto">
            <POICard poi={selectedPoi} onClose={deselect} onNavigate={() => {}} onSelect={selectPoi} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

export default MapIndex;
