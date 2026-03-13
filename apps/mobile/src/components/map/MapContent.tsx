import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// State & Store
import { useMapStore } from '../../store/useMapStore';
import { useRoute } from '../../hooks/queries/useRoute';
import { usePathNetwork } from '../../hooks/queries/usePathNetwork';

// Constants & Utilities
import { 
  EMPTY_GEOJSON, 
  MAP_CENTER, 
  DEFAULT_ZOOM,
} from '../../constants/mapConstants';
import { mapLayerStyles } from '../../styles/mapLayerStyles';
import { theme } from '../../styles/theme';
import { colors } from '../../styles/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapContentProps {
  userCoords: number[] | null;
  locationStatus: string;
  poisGeoJSON: any;
  savedLocations?: any;
  onDeselect?: () => void;
  sheetPosition: SharedValue<number>;
}

export const MapContent = React.memo(({ 
  userCoords, 
  poisGeoJSON,
  savedLocations,
  onDeselect,
}: MapContentProps) => {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  const insets = useSafeAreaInsets();
  const lastPressTime = useRef<number>(0);
  
  const selectedPoiId = useMapStore(s => s.selectedPoiId);
  const selectedCoords = useMapStore(s => s.selectedCoords);
  const recenterCount = useMapStore(s => s.recenterCount);
  const currentRoute = useMapStore(s => s.currentRoute);
  const isNavigating = useMapStore(s => s.isNavigating);
  const selectPoi = useMapStore(s => s.selectPoi);
  const storeDeselect = useMapStore(s => s.deselect);

  // Optimized selection GeoJSON - This is the key for instant updates
  const selectionGeoJSON = useMemo(() => {
    if (!selectedCoords) return EMPTY_GEOJSON;
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: selectedCoords },
        properties: { id: selectedPoiId }
      }]
    };
  }, [selectedCoords, selectedPoiId]);

  const routeRequest = useMemo(() => {
    if (selectedPoiId && userCoords && !isNaN(Number(selectedPoiId))) {
      return { origin: { lat: userCoords[1], lng: userCoords[0] }, destination: { poiId: Number(selectedPoiId) } };
    }
    return null;
  }, [selectedPoiId, userCoords]);
  
  useRoute(routeRequest);
  const { data: pathNetwork } = usePathNetwork();

  // Camera Effects
  useEffect(() => {
    if (recenterCount > 0 && camera.current && userCoords) {
      camera.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: 800,
        animationMode: 'flyTo',
        padding: { paddingBottom: 150, paddingTop: 60, paddingLeft: 20, paddingRight: 20 }
      });
    }
  }, [recenterCount, userCoords]);

  useEffect(() => {
    if (selectedCoords && camera.current && !isNavigating) {
      camera.current.setCamera({
        centerCoordinate: selectedCoords,
        zoomLevel: 17.2,
        animationDuration: 400,
        animationMode: 'flyTo',
        padding: { 
          paddingBottom: SCREEN_HEIGHT * 0.45, 
          paddingTop: insets.top + 40, 
          paddingLeft: 20, 
          paddingRight: 20 
        }
      });
    }
  }, [selectedCoords, isNavigating, insets.top]);

  // HIGH PERFORMANCE PRESS HANDLERS
  const handleMapPress = useCallback(() => {
    if (Date.now() - lastPressTime.current < 150) return;
    if (onDeselect) onDeselect();
    else storeDeselect();
  }, [onDeselect, storeDeselect]);

  const onSourcePress = useCallback((event: any) => {
    lastPressTime.current = Date.now();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Instant feedback
    
    const feature = event.features[0];
    if (feature) {
      selectPoi({
        id: feature.properties.id,
        name: feature.properties.name,
        category: feature.properties.category,
        geometry: feature.geometry
      });
    }
  }, [selectPoi]);

  return (
    <View style={{ flex: 1 }}>
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        onPress={handleMapPress}
      >
        <MapLibreGL.Camera
          ref={camera}
          minZoomLevel={11}
          defaultSettings={{ centerCoordinate: MAP_CENTER, zoomLevel: DEFAULT_ZOOM }}
          followUserLocation={isNavigating}
          followUserMode={isNavigating ? 'compass' : 'normal'}
          followZoomLevel={18}
          followPitch={45}
        />

        {/* 1. POIs Source (Native layer, no filtering) */}
        <MapLibreGL.ShapeSource 
          id="poisSource" 
          shape={poisGeoJSON || EMPTY_GEOJSON}
          onPress={onSourcePress}
          hitbox={{ width: 44, height: 44 }}
        >
          <MapLibreGL.CircleLayer id="poiCircles" style={mapLayerStyles.poiCircles} minZoomLevel={12.8} />
          <MapLibreGL.SymbolLayer id="poiLabels" style={mapLayerStyles.poiLabels} minZoomLevel={15.8} />
        </MapLibreGL.ShapeSource>

        {/* 2. Saved Source */}
        <MapLibreGL.ShapeSource 
          id="savedSource" 
          shape={savedLocations || EMPTY_GEOJSON}
          onPress={onSourcePress}
          hitbox={{ width: 44, height: 44 }}
        >
          <MapLibreGL.CircleLayer id="savedCircles" style={mapLayerStyles.savedPoiCircles} minZoomLevel={12.8} />
          <MapLibreGL.SymbolLayer id="savedLabels" style={mapLayerStyles.poiLabels} minZoomLevel={15.8} />
        </MapLibreGL.ShapeSource>

        {/* 3. SELECTION SOURCE (Separate for instant rendering) */}
        <MapLibreGL.ShapeSource id="selectionSource" shape={selectionGeoJSON}>
          <MapLibreGL.CircleLayer 
            id="selectedPoiHighlight" 
            style={{ 
              circleRadius: 22, 
              circleColor: 'white', 
              circleOpacity: 0.2,
              circleStrokeWidth: 2,
              circleStrokeColor: 'white'
            }} 
          />
          <MapLibreGL.CircleLayer 
            id="selectedPoiInner" 
            style={{ 
              circleRadius: 18, 
              circleColor: colors.primary, // Using Magic Gem instead of Red
              circleStrokeWidth: 2,
              circleStrokeColor: 'white'
            }} 
          />
        </MapLibreGL.ShapeSource>

        {/* 4. Path Network & Routes */}
        <MapLibreGL.ShapeSource id="networkSource" shape={pathNetwork || EMPTY_GEOJSON}>
          <MapLibreGL.LineLayer id="networkLines" style={{ ...mapLayerStyles.networkLines, lineOpacity: 0.15 }} />
        </MapLibreGL.ShapeSource>

        {isNavigating && currentRoute && (
          <MapLibreGL.ShapeSource id="routeSource" shape={currentRoute}>
            <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
            <MapLibreGL.LineLayer id="routeGlow" style={{ ...mapLayerStyles.routeGlow, lineBlur: 4 }} />
          </MapLibreGL.ShapeSource>
        )}
      </MapLibreGL.MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1, backgroundColor: theme.colors.background },
});