import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withRepeat,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';
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
  SELECT_ANIMATION_DURATION,
  FLY_ANIMATION_DURATION
} from '../../constants/mapConstants';
import { mapLayerStyles } from '../../styles/mapLayerStyles';
import { theme } from '../../styles/theme';
import { getCategoryMetadata } from '../../utils/poiUtils';

interface MapContentProps {
  userCoords: number[] | null;
  locationStatus: string;
  poisGeoJSON: any;
  savedLocations?: any;
  onDeselect?: () => void;
}

const PulsingUserLocation = React.memo(() => {
  const pulse = useSharedValue(1);
  
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.6, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const rPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: withTiming(0.4 / pulse.value),
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View 
        style={[
          {
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
          },
          rPulseStyle
        ]}
      />
      <View style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#0A0A0A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      }} />
    </View>
  );
});

const PoiMarker = React.memo(({ 
  isSelected, 
  metadata, 
  onPress,
  index
}: { 
  isSelected: boolean; 
  metadata: any; 
  onPress: () => void;
  index: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSelected ? 1.15 : 1, { damping: 15 }) }],
      backgroundColor: withTiming(isSelected ? 'white' : metadata.color, { duration: 250 }),
      borderColor: withTiming(isSelected ? metadata.color : 'white', { duration: 250 }),
      width: isSelected ? 40 : 32,
      height: isSelected ? 40 : 32,
      borderRadius: isSelected ? 20 : 16,
    };
  }, [isSelected, metadata.color]);

  return (
    <Animated.View 
      entering={FadeInDown.delay(Math.min(index * 30, 800)).springify()}
      style={styles.markerContainer}
    >
      <Animated.View 
        onTouchStart={onPress}
        style={[
          styles.markerBase,
          animatedStyle
        ]}
      >
        <MaterialCommunityIcons
          name={metadata.icon as any}
          size={isSelected ? 20 : 16}
          color={isSelected ? metadata.color : 'white'}
        />
      </Animated.View>
    </Animated.View>
  );
});

export const MapContent = React.memo(({ 
  userCoords, 
  locationStatus, 
  poisGeoJSON,
  savedLocations,
  onDeselect
}: MapContentProps) => {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  
  // State from Store
  const selectedPoiId = useMapStore(s => s.selectedPoiId);
  const selectedCoords = useMapStore(s => s.selectedCoords);
  const recenterCount = useMapStore(s => s.recenterCount);
  const currentRoute = useMapStore(s => s.currentRoute);
  const selectPoi = useMapStore(s => s.selectPoi);
  const storeDeselect = useMapStore(s => s.deselect);

  const lastSelectionTime = useRef(0);

  // Queries
  const { data: pathNetwork } = usePathNetwork();
  
  const routeRequest = useMemo(() => {
    // Only request routes for database POIs (number IDs)
    if (selectedPoiId && userCoords && typeof selectedPoiId === 'number') {
      return {
        origin: { lat: userCoords[1], lng: userCoords[0] },
        destination: { poiId: selectedPoiId },
      } as any;
    }
    return null;
  }, [selectedPoiId, userCoords]);

  useRoute(routeRequest);

  // Camera Management
  useEffect(() => {
    if (recenterCount > 0 && userCoords && camera.current) {
      camera.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: FLY_ANIMATION_DURATION,
        animationMode: 'flyTo',
      });
    }
  }, [recenterCount, userCoords]);

  useEffect(() => {
    if (selectedCoords && camera.current) {
      camera.current.setCamera({
        centerCoordinate: selectedCoords,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: SELECT_ANIMATION_DURATION,
        animationMode: 'flyTo',
      });
    }
  }, [selectedCoords]);

  // Event Handlers
  const onMapPress = useCallback(() => {
    const now = Date.now();
    if (now - lastSelectionTime.current < 400) return;
    
    console.log('[MapContent] Interaction: Map deselection');
    Haptics.selectionAsync();
    
    if (onDeselect) {
      onDeselect();
    } else {
      storeDeselect();
    }
  }, [onDeselect, storeDeselect]);

  const onPoiPress = useCallback((id: string | number, coords: number[]) => {
    console.log('[MapContent] Interaction: Marker selected:', id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    lastSelectionTime.current = Date.now();
    selectPoi(id, coords);
  }, [selectPoi]);

  // Render Helpers
  const renderMarkers = useMemo(() => {
    const markers: React.ReactNode[] = [];

    // 1. Standard POIs
    if (poisGeoJSON?.features) {
      poisGeoJSON.features.forEach((feature: any, index: number) => {
        const id = feature.properties.id;
        const isSelected = String(id) === String(selectedPoiId);
        const coords = feature.geometry.coordinates;
        const metadata = getCategoryMetadata(feature.properties.category);

        markers.push(
          <MapLibreGL.MarkerView
            key={`poi-${id}`}
            id={`poi-marker-${id}`}
            coordinate={coords}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <PoiMarker 
              isSelected={isSelected}
              metadata={metadata}
              onPress={() => onPoiPress(id, coords)}
              index={index}
            />
          </MapLibreGL.MarkerView>
        );
      });
    }

    // 2. Saved Locations (Green)
    if (savedLocations?.features) {
      savedLocations.features.forEach((feature: any, index: number) => {
        const id = feature.properties.id;
        const finalId = `saved_${id}`;
        const isSelected = finalId === String(selectedPoiId);
        const coords = feature.geometry.coordinates;
        
        // Custom metadata for saved markers (themed green)
        const savedMetadata = {
          icon: 'star',
          color: '#30D158', // Green
          label: feature.properties.label
        };

        markers.push(
          <MapLibreGL.MarkerView
            key={finalId}
            id={`saved-marker-${id}`}
            coordinate={coords}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <PoiMarker 
              isSelected={isSelected}
              metadata={savedMetadata}
              onPress={() => onPoiPress(finalId, coords)}
              index={poisGeoJSON?.features?.length || 0 + index} // Offset delay
            />
          </MapLibreGL.MarkerView>
        );
      });
    }

    return markers;
  }, [poisGeoJSON, savedLocations, selectedPoiId, onPoiPress]);

  return (
    <MapLibreGL.MapView
      style={styles.map}
      mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      logoEnabled={false}
      attributionEnabled={false}
      compassEnabled={false}
      onPress={onMapPress}
    >
      <MapLibreGL.Camera
        ref={camera}
        minZoomLevel={12}
        defaultSettings={{
          centerCoordinate: MAP_CENTER,
          zoomLevel: DEFAULT_ZOOM,
        }}
      />

      <MapLibreGL.UserLocation 
        visible={locationStatus === 'granted'} 
        renderMode="normal" 
      >
        <MapLibreGL.SymbolLayer
          id="userHeadingIndicator"
          style={{
            iconImage: 'arrow', 
            iconSize: 0.5,
            iconRotate: ['get', 'heading'],
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
          }}
        />
      </MapLibreGL.UserLocation>

      {/* Separate MarkerView for Pulsing User Location to avoid crash */}
      {locationStatus === 'granted' && userCoords && (
        <MapLibreGL.MarkerView coordinate={userCoords}>
          <PulsingUserLocation />
        </MapLibreGL.MarkerView>
      )}

      {/* Network Background */}
      <MapLibreGL.ShapeSource 
        id="networkSource" 
        shape={pathNetwork || EMPTY_GEOJSON}
      >
        <MapLibreGL.LineLayer
          id="networkLines"
          style={{
            ...mapLayerStyles.networkLines,
            lineOpacity: pathNetwork ? 0.3 : 0,
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* Active Route */}
      <MapLibreGL.ShapeSource 
        id="routeSource" 
        shape={currentRoute || EMPTY_GEOJSON}
      >
        <MapLibreGL.LineLayer
          id="routeFill"
          style={{
            ...mapLayerStyles.routeFill,
            lineOpacity: currentRoute ? 0.95 : 0,
          }}
        />
        <MapLibreGL.LineLayer
          id="routeGlow"
          style={{
            ...mapLayerStyles.routeGlow,
            lineOpacity: currentRoute ? 0.3 : 0,
            lineBlur: 4,
          }}
        />
      </MapLibreGL.ShapeSource>
      {/* Points of Interest & Saved Locations (Animated Markers) */}
      {renderMarkers}
    </MapLibreGL.MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  markerContainer: {
    // This wrapper handles the entering animation separately from the transform style
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBase: {
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});
