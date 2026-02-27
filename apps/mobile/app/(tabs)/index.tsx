import '../../src/utils/viro-shim';
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
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
import { usePOIs } from '../../src/hooks/queries/usePOIs';
import { useCategories } from '../../src/hooks/queries/useCategories';
import { getCategoryIcon } from '../../src/utils/poiUtils';
import Animated from 'react-native-reanimated';
import { useLocationService } from '../../src/hooks/useLocationService';
import { useCameraTilt } from '../../src/hooks/useCameraTilt';
import { AROverlay } from '../../src/components/ar/AROverlay';
import { Camera } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { useMapStore } from '../../src/store/useMapStore';
import { MapContent } from '../../src/components/map/MapContent';

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

  const { pitch, arState } = useCameraTilt();
  const [cameraPermission, setCameraPermission] = React.useState<boolean | null>(null);

  useEffect(() => {
    if (arState === 'AR' && cameraPermission === null) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
      })();
    }
  }, [arState, cameraPermission]);

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
        <AROverlay isVisible={arState === 'AR' && cameraPermission === true} />
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
                  onPress={() => setActiveCategoryId(prev => prev === cat.id ? null : cat.id)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* AR Debug Indicator */}
        <View className="absolute top-14 right-4 items-end">
          <View style={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} className="px-3 py-1 rounded-full flex-row items-center gap-2">
            <View className={`w-2 h-2 rounded-full ${arState === 'AR' ? 'bg-green-500' : arState === 'TRANSITION' ? 'bg-yellow-500' : 'bg-zinc-500'}`} />
            <Text className="text-white text-xs font-medium">Pitch: {Math.round(pitch)}° ({arState})</Text>
          </View>
        </View>

        <View className="flex-1" />

        <Animated.View pointerEvents="box-none" className="pb-4">
          <View pointerEvents="auto" className="items-end px-4 mb-3 gap-3">
            <TouchableOpacity 
              onPress={handleRecenter}
              className="w-10 h-10 items-center justify-center rounded-full" 
              style={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Feather name="navigation" size={20} color="white" />
            </TouchableOpacity>
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
