import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  useSharedValue,
  FadeInDown,
  useAnimatedReaction,
  runOnJS,
  SharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
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
  FLY_ANIMATION_DURATION
} from '../../constants/mapConstants';
import { mapLayerStyles } from '../../styles/mapLayerStyles';
import { theme } from '../../styles/theme';
import { getCategoryMetadata } from '../../utils/poiUtils';
import { typography } from '../../styles/typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapContentProps {
  userCoords: number[] | null;
  locationStatus: string;
  poisGeoJSON: any;
  savedLocations?: any;
  onDeselect?: () => void;
  sheetPosition: SharedValue<number>;
}

// Fluid Marker component
const PoiMarker = React.memo(({ 
  isSelected, 
  metadata, 
  onPress,
  label,
  zoomValue,
  isImportant
}: { 
  isSelected: boolean; 
  metadata: any; 
  onPress: () => void;
  label?: string;
  zoomValue: SharedValue<number>;
  isImportant: boolean;
}) => {
  const rMarkerStyle = useAnimatedStyle(() => {
    // Stage 1: Scale and fade icons
    const fadeStart = isImportant ? 12.8 : 14.0;
    const fadeEnd = isImportant ? 14.5 : 15.5;
    
    const opacity = interpolate(zoomValue.value, [fadeStart, fadeEnd], [0, 1], Extrapolate.CLAMP);
    const scale = interpolate(zoomValue.value, [fadeStart, fadeEnd], [0.4, 1], Extrapolate.CLAMP);

    return {
      opacity: isSelected ? 1 : opacity,
      transform: [{ scale: isSelected ? 1.15 : scale }],
    };
  });

  const rLabelStyle = useAnimatedStyle(() => {
    // Stage 2: Fade labels out much faster for a clean look
    const opacity = interpolate(zoomValue.value, [15.8, 16.5], [0, 1], Extrapolate.CLAMP);
    return { opacity };
  });

  return (
    <Animated.View style={rMarkerStyle}>
      <Pressable onPress={onPress} style={styles.markerContainer}>
        <View style={[styles.markerSymbol, { backgroundColor: isSelected ? metadata.color : 'white' }]}>
          <MaterialCommunityIcons
            name={metadata.icon as any}
            size={isSelected ? 20 : 16}
            color={isSelected ? 'white' : metadata.color}
          />
        </View>
        {!isSelected && label && (
          <Animated.Text style={[styles.markerLabelText, rLabelStyle]} numberOfLines={1}>
            {label}
          </Animated.Text>
        )}
      </Pressable>
    </Animated.View>
  );
});

export const MapContent = React.memo(({ 
  userCoords, 
  locationStatus, 
  poisGeoJSON,
  savedLocations,
  onDeselect,
  sheetPosition
}: MapContentProps) => {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  const insets = useSafeAreaInsets();
  const zoomValue = useSharedValue(DEFAULT_ZOOM);
  
  const selectedPoiId = useMapStore(s => s.selectedPoiId);
  const selectedCoords = useMapStore(s => s.selectedCoords);
  const recenterCount = useMapStore(s => s.recenterCount);
  const currentRoute = useMapStore(s => s.currentRoute);
  const isNavigating = useMapStore(s => s.isNavigating);
  const selectPoi = useMapStore(s => s.selectPoi);
  const storeDeselect = useMapStore(s => s.deselect);

  const syncCamera = useCallback((y: number) => {
    if (camera.current && selectedCoords && !isNavigating) {
      camera.current.setCamera({
        centerCoordinate: selectedCoords,
        padding: {
          paddingBottom: SCREEN_HEIGHT - y + 20,
          paddingTop: insets.top + 60,
          paddingLeft: 20,
          paddingRight: 20,
        },
        animationDuration: 0,
      });
    }
  }, [selectedCoords, isNavigating, insets.top]);

  useAnimatedReaction(() => sheetPosition.value, (y) => runOnJS(syncCamera)(y), [syncCamera]);

  const { data: pathNetwork } = usePathNetwork();
  const routeRequest = useMemo(() => {
    if (selectedPoiId && userCoords && !isNaN(Number(selectedPoiId))) {
      return { origin: { lat: userCoords[1], lng: userCoords[0] }, destination: { poiId: Number(selectedPoiId) } };
    }
    return null;
  }, [selectedPoiId, userCoords]);
  useRoute(routeRequest);

  useEffect(() => {
    if (recenterCount > 0 && camera.current && userCoords) {
      camera.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: FLY_ANIMATION_DURATION,
        animationMode: 'flyTo',
        padding: { paddingBottom: 120, paddingTop: 60, paddingLeft: 20, paddingRight: 20 }
      });
    }
  }, [recenterCount, userCoords]);

  useEffect(() => {
    if (selectedCoords && camera.current && !isNavigating) {
      camera.current.setCamera({
        centerCoordinate: selectedCoords,
        zoomLevel: 17.5,
        animationDuration: 600,
        animationMode: 'flyTo',
        padding: { paddingBottom: 350, paddingTop: 60, paddingLeft: 20, paddingRight: 20 }
      });
    }
  }, [selectedCoords, isNavigating]);

  const onPoiPress = useCallback((poi: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    selectPoi(poi);
  }, [selectPoi]);

  // Venue Marker Visibility Logic
  const rVenueStyle = useAnimatedStyle(() => {
    const opacity = interpolate(zoomValue.value, [12.0, 13.8], [1, 0], Extrapolate.CLAMP);
    const scale = interpolate(zoomValue.value, [12.0, 13.8], [1, 0.7], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ scale }],
      pointerEvents: zoomValue.value < 13.8 ? 'auto' : 'none',
    };
  });

  const renderMarkers = useMemo(() => {
    const markers: React.ReactNode[] = [];

    if (poisGeoJSON?.features) {
      poisGeoJSON.features.forEach((feature: any) => {
        const id = feature.properties.id;
        const isSelected = String(id) === String(selectedPoiId);
        const metadata = getCategoryMetadata(feature.properties.category);
        const isImportant = ['gate', 'grandstand', 'medical'].includes(feature.properties.category);

        markers.push(
          <MapLibreGL.MarkerView
            key={`poi-${id}`}
            coordinate={feature.geometry.coordinates}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <PoiMarker 
              isSelected={isSelected}
              isImportant={isImportant}
              metadata={metadata}
              onPress={() => onPoiPress({ ...feature.properties, geometry: feature.geometry })}
              label={feature.properties.name}
              zoomValue={zoomValue}
            />
          </MapLibreGL.MarkerView>
        );
      });
    }

    if (savedLocations?.features) {
      savedLocations.features.forEach((feature: any) => {
        const id = feature.properties.id;
        markers.push(
          <MapLibreGL.MarkerView
            key={`saved-${id}`}
            coordinate={feature.geometry.coordinates}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <PoiMarker 
              isSelected={`saved_${id}` === String(selectedPoiId)}
              isImportant={false}
              metadata={{ icon: 'star', color: '#FFD60A', label: feature.properties.label }}
              onPress={() => onPoiPress({ ...feature.properties, id: `saved_${id}`, name: feature.properties.label, geometry: feature.geometry })}
              label={feature.properties.label}
              zoomValue={zoomValue}
            />
          </MapLibreGL.MarkerView>
        );
      });
    }

    return markers;
  }, [poisGeoJSON, savedLocations, selectedPoiId, onPoiPress]);

  return (
    <View style={{ flex: 1 }}>
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        onPress={onDeselect || storeDeselect}
        onRegionIsChanging={(f) => {
          zoomValue.value = f.properties.zoomLevel;
        }}
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

        <MapLibreGL.MarkerView coordinate={MAP_CENTER}>
          <Animated.View style={[styles.venueMarkerContainer, rVenueStyle]}>
            <View style={styles.venueIconCircle}>
              <MaterialCommunityIcons name="school" size={32} color="white" />
            </View>
            <View style={styles.venueTag}>
              <Text style={styles.venueText}>INSTITUT PEDRALBES</Text>
            </View>
          </Animated.View>
        </MapLibreGL.MarkerView>

        <MapLibreGL.ShapeSource id="networkSource" shape={pathNetwork || EMPTY_GEOJSON}>
          <MapLibreGL.LineLayer id="networkLines" style={{ ...mapLayerStyles.networkLines, lineOpacity: 0.15 }} />
        </MapLibreGL.ShapeSource>

        {isNavigating && currentRoute && (
          <MapLibreGL.ShapeSource id="routeSource" shape={currentRoute}>
            <MapLibreGL.LineLayer id="routeFill" style={mapLayerStyles.routeFill} />
            <MapLibreGL.LineLayer id="routeGlow" style={{ ...mapLayerStyles.routeGlow, lineBlur: 4 }} />
          </MapLibreGL.ShapeSource>
        )}

        {renderMarkers}
      </MapLibreGL.MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1, backgroundColor: theme.colors.background },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  markerSymbol: { width: 34, height: 32, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  markerLabelText: { fontSize: 10, fontFamily: typography.secondary.bold, marginTop: 6, color: 'white', textShadowColor: 'black', textShadowRadius: 2, textShadowOffset: { width: 0, height: 1 } },
  venueMarkerContainer: { alignItems: 'center', justifyContent: 'center' },
  venueIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E10600', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 15 },
  venueTag: { backgroundColor: 'white', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 16, marginTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  venueText: { color: '#0A0A0A', fontSize: 14, fontFamily: typography.primary.bold, letterSpacing: 0.5 },
});
