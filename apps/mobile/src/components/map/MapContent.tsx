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
  SELECT_ANIMATION_DURATION,
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
  label
}: { 
  isSelected: boolean; 
  metadata: any; 
  onPress: () => void;
  label?: string;
}) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={styles.markerContainer}
    >
      <View style={styles.markerSymbol}>
        <MaterialCommunityIcons
          name={metadata.icon as any}
          size={isSelected ? 20 : 16}
          color={isSelected ? 'white' : metadata.color}
        />
      </View>
      <Text 
        style={[
          styles.markerLabelText,
          { color: isSelected ? 'white' : metadata.color }
        ]} 
        numberOfLines={1}
      >
        {label || metadata.label}
      </Text>
    </Pressable>
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
  const isNavigating = useMapStore(s => s.isNavigating);
  const selectPoi = useMapStore(s => s.selectPoi);
  const setNavigating = useMapStore(s => s.setNavigating);
  const storeDeselect = useMapStore(s => s.deselect);

  const lastSelectionTime = useRef(0);

  // Queries
  const { data: pathNetwork } = usePathNetwork();
  
  const routeRequest = useMemo(() => {
    if (selectedPoiId && userCoords && !isNaN(Number(selectedPoiId))) {
      return {
        origin: { lat: userCoords[1], lng: userCoords[0] },
        destination: { poiId: Number(selectedPoiId) },
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
    if (selectedCoords && camera.current && !isNavigating) {
      // DEBUG LOG
      console.log('[Camera] Attempting to center on:', selectedCoords);
      
      // TRUCO: Calculamos un punto de enfoque ligeramente al SUR del POI
      // Esto empuja el POI hacia ARRIBA en la pantalla, pero con cuidado de no sacarlo
      const focusCoords = [
        selectedCoords[0], // longitud igual
        selectedCoords[1] - 0.0006 // latitud un poco más abajo (sur) - ajuste final
      ];

      camera.current.setCamera({
        centerCoordinate: focusCoords,
        zoomLevel: 17.2,
        animationDuration: 600,
        animationMode: 'flyTo',
      });
    }
  }, [selectedCoords, isNavigating]);

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

  const onPoiPress = useCallback((poi: any) => {
    console.log('[MapContent] Interaction: Marker selected:', poi.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    lastSelectionTime.current = Date.now();
    selectPoi(poi);
  }, [selectPoi]);

  const insets = useSafeAreaInsets();

  const destinationName = useMemo(() => {
    if (!selectedPoiId || !poisGeoJSON?.features) return 'Destino';
    const poi = poisGeoJSON.features.find((f: any) => String(f.properties.id) === String(selectedPoiId));
    return poi?.properties.name || 'Destino';
  }, [selectedPoiId, poisGeoJSON]);

  // Render Helpers
  const renderMarkers = useMemo(() => {
    const markers: React.ReactNode[] = [];

    // 1. Standard POIs
    if (poisGeoJSON?.features) {
      poisGeoJSON.features.forEach((feature: any) => {
        const id = feature.properties.id;
        const isSelected = String(id) === String(selectedPoiId);
        const coords = feature.geometry.coordinates;
        const metadata = getCategoryMetadata(feature.properties.category);
        const poiObject = { ...feature.properties, geometry: feature.geometry };

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
              onPress={() => onPoiPress(poiObject)}
              label={feature.properties.name}
            />
          </MapLibreGL.MarkerView>
        );
      });
    }

    // 2. Saved Locations
    if (savedLocations?.features) {
      savedLocations.features.forEach((feature: any) => {
        const id = feature.properties.id;
        const finalId = `saved_${id}`;
        const isSelected = finalId === String(selectedPoiId);
        const coords = feature.geometry.coordinates;
        const poiObject = { ...feature.properties, id: finalId, name: feature.properties.label, geometry: feature.geometry };
        
        const savedMetadata = {
          icon: 'star',
          color: '#B4D99B', 
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
              onPress={() => onPoiPress(poiObject)}
              label={feature.properties.label}
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
        onPress={onMapPress}
      >
        <MapLibreGL.Camera
          ref={camera}
          minZoomLevel={12}
          defaultSettings={{
            centerCoordinate: MAP_CENTER,
            zoomLevel: DEFAULT_ZOOM,
          }}
          followUserLocation={isNavigating}
          followUserMode={(isNavigating ? 'compass' : 'normal') as any}
          followZoomLevel={18}
          followPitch={45}
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

      {locationStatus === 'granted' && userCoords && (
        <MapLibreGL.MarkerView coordinate={userCoords}>
          <PulsingUserLocation />
        </MapLibreGL.MarkerView>
      )}

      {/* Network Background */}
      <MapLibreGL.ShapeSource id="networkSource" shape={pathNetwork || EMPTY_GEOJSON}>
        <MapLibreGL.LineLayer
          id="networkLines"
          style={{ ...mapLayerStyles.networkLines, lineOpacity: pathNetwork ? 0.3 : 0 }}
        />
      </MapLibreGL.ShapeSource>

      {/* Active Route */}
      <MapLibreGL.ShapeSource id="routeSource" shape={currentRoute || EMPTY_GEOJSON}>
        <MapLibreGL.LineLayer
          id="routeFill"
          style={{ ...mapLayerStyles.routeFill, lineOpacity: currentRoute ? 0.95 : 0 }}
        />
        <MapLibreGL.LineLayer
          id="routeGlow"
          style={{ ...mapLayerStyles.routeGlow, lineOpacity: currentRoute ? 0.3 : 0, lineBlur: 4 }}
        />
      </MapLibreGL.ShapeSource>

      {renderMarkers}
      </MapLibreGL.MapView>

      {/* Top Navigation Bar */}
      {isNavigating && (
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.topNavContainer, { paddingTop: insets.top + 10 }]}>
          <View style={styles.topNavContent}>
            <View style={styles.topNavLeft}>
              <MaterialCommunityIcons name="arrow-up" size={32} color="white" />
            </View>
            <View style={styles.topNavCenter}>
              <Text style={styles.topNavInstruction}>Hacia</Text>
              <Text style={styles.topNavDestination} numberOfLines={1}>{destinationName}</Text>
            </View>
            <View style={styles.topNavRight}>
              <View style={styles.sparkleCircle}>
                <MaterialCommunityIcons name={"sparkles" as any} size={20} color="#006B6B" />
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Bottom Navigation Bar */}
      {isNavigating && (
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={[styles.bottomNavContainer, { paddingBottom: insets.bottom + 10 }]}>
          <View style={styles.bottomNavHeader}>
            <View style={styles.bottomNavInfo}>
              <View style={styles.durationRow}>
                <Text style={styles.durationText}>7 min</Text>
                <MaterialCommunityIcons name="walk" size={24} color="#007AFF" style={{ marginLeft: 8 }} />
              </View>
              <Text style={styles.distanceText}>500 m • 23:03</Text>
            </View>
            <Pressable onPress={() => setNavigating(false)} style={styles.googleExitButton}>
              <Text style={styles.exitButtonText}>Salir</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1, backgroundColor: theme.colors.background },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  markerSymbol: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  markerLabelText: {
    fontSize: 10,
    fontFamily: typography.secondary.bold,
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    maxWidth: 80,
    textAlign: 'center',
  },
  topNavContainer: { position: 'absolute', top: 0, left: 10, right: 10 },
  topNavContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#006B6B', padding: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  topNavLeft: { marginRight: 16 },
  topNavCenter: { flex: 1 },
  topNavInstruction: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  topNavDestination: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  topNavRight: { marginLeft: 8 },
  sparkleCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  bottomNavContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#1C1C1C', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  bottomNavHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottomNavInfo: { flex: 1 },
  durationRow: { flexDirection: 'row', alignItems: 'center' },
  durationText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  distanceText: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 2 },
  googleExitButton: { backgroundColor: '#EA4335', paddingHorizontal: 24, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  exitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
