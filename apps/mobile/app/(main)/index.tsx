import React, { useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { FilterChip } from '../../src/components/FilterChip';
import { POICard } from '../../src/components/POICard';
import { colors } from '../../src/styles/colors';
import { usePOIs } from '../../src/hooks/queries/usePOIs';
import { useCategories } from '../../src/hooks/queries/useCategories';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocationService } from '../../src/hooks/useLocationService';
import { useCameraTilt } from '../../src/hooks/useCameraTilt';
import { AROverlay } from '../../src/components/ar/AROverlay';
import { Feather } from '@expo/vector-icons';
import { useMapStore } from '../../src/store/useMapStore';
import { MapContent } from '../../src/components/map/MapContent';
import { MapBottomSheet } from '../../src/components/map/MapBottomSheet';
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
  const router = useRouter();
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
            console.log('User requested AR exit');
          }}
        />
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}
      </View>

      {/* Map Controls (Floating) */}
      <View pointerEvents="box-none" style={[styles.overlay, { paddingBottom: 120 }]}>
        <View className="flex-1" />
        <View pointerEvents="auto" className="items-end px-4 mb-3">
          <Pressable 
            onPress={handleRecenter}
            className="w-12 h-12 items-center justify-center rounded-full active:opacity-70 bg-black/80 border border-white/10"
          >
            <Feather name="navigation" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Apple/Waze Style Bottom Sheet */}
      <MapBottomSheet 
        header={
          <SearchBar onArPress={() => router.push('/(main)/profile')} />
        }
      >
        <View className="mt-2">
          <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Quick Access</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="flex-row"
          >
            {categories?.map((cat) => (
              <FilterChip
                key={cat.id}
                label={cat.label}
                icon={cat.icon as any}
                active={activeCategoryId === cat.id}
                onPress={() => {
                  if (DIRECT_ACCESS_CATEGORIES.includes(cat.category)) {
                    const poi = poisData?.features.find((f: any) => f.properties.category === cat.category);
                    if (poi) {
                      selectPoi(poi.properties.id, poi.geometry.coordinates);
                    }
                  } else {
                    setActiveCategoryId(prev => prev === cat.id ? null : cat.id);
                    deselect();
                  }
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Selected POI Details inside the sheet */}
        {selectedPoi && (
          <Animated.View entering={FadeInDown} className="mt-8">
            <POICard poi={selectedPoi} onClose={deselect} onNavigate={() => {}} onSelect={selectPoi} noFloat />
          </Animated.View>
        )}
      </MapBottomSheet>
    </View>
  );
}

export default MapIndex;
