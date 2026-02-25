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
import { Feather } from '@expo/vector-icons';
import { useMapStore } from '../../src/store/useMapStore';

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

const MapContent = React.memo(({ 
  userCoords, 
  locationStatus, 
  poisGeoJSON 
}: any) => {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  const { selectedPoiId, selectPoi, deselect } = useMapStore();
  const isSelectingMarker = useRef(false);

  const onMapPress = useCallback(() => {
    if (isSelectingMarker.current) {
      isSelectingMarker.current = false;
      return;
    }
    deselect();
  }, [deselect]);

  const onSourcePress = useCallback((event: any) => {
    const feature = event.features[0];
    if (feature?.properties && feature.geometry.type === 'Point') {
      isSelectingMarker.current = true;
      selectPoi(feature.properties.id, feature.geometry.coordinates);
    }
  }, [selectPoi]);

  return (
    <MapLibreGL.MapView
      style={[{ flex: 1, backgroundColor: '#0A0A0A' }]}
      mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      logoEnabled={false}
      attributionEnabled={false}
      compassEnabled={false}
      rotateEnabled={true}
      zoomEnabled={true}
      pitchEnabled={true}
      onPress={onMapPress}
    >
      <MapLibreGL.Camera
        ref={camera}
        minZoomLevel={12}
        maxBounds={{ ne: [2.142, 41.413], sw: [2.07, 41.359] }}
        defaultSettings={{
          centerCoordinate: [2.1060698, 41.3863034],
          zoomLevel: 19,
        }}
      />

      {locationStatus === 'granted' && (
        <MapLibreGL.UserLocation visible={true} renderMode="normal" />
      )}

      {poisGeoJSON && (
        <MapLibreGL.ShapeSource id="pois-source" shape={poisGeoJSON} onPress={onSourcePress}>
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

      {selectedPoiId && poisGeoJSON && (
        <SelectedMarker key={`selected-${selectedPoiId}`} id={selectedPoiId} poisGeoJSON={poisGeoJSON} />
      )}
    </MapLibreGL.MapView>
  );
});

const SelectedMarker = React.memo(({ id, poisGeoJSON }: any) => {
  const feature = poisGeoJSON.features.find((f: any) => f.properties.id === id);
  if (!feature) return null;

  return (
    <MapLibreGL.MarkerView coordinate={feature.geometry.coordinates}>
      <View className="items-center">
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, borderWidth: 2, borderColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 10 }}>
          <Feather name={getCategoryIcon(feature.properties.category) as any} size={18} color="white" />
        </View>
        <Text className="text-white text-[12px] font-bold mt-1 text-center" style={{ textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
          {feature.properties.name}
        </Text>
      </View>
    </MapLibreGL.MarkerView>
  );
});

export default function MapScreen() {
  const { coords: userCoords, status: locationStatus, requestPermission } = useLocationService();
  const { selectedPoiId, deselect, selectPoi } = useMapStore();
  const { data: categories } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);

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
    // Manual recenter logic removed as per "remove everything to do with camera"
  }, [requestPermission]);

  return (
    <View className="flex-1 bg-black">
      <View style={styles.mapContainer}>
        <MapContent 
          userCoords={userCoords}
          locationStatus={locationStatus}
          poisGeoJSON={poisData}
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
                  onPress={() => setActiveCategoryId(prev => prev === cat.id ? null : cat.id)}
                />
              ))}
            </ScrollView>
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
