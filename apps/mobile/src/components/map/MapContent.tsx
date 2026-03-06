import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';
import { getCategoryIcon, getCategoryMetadata } from '../../utils/poiUtils';
import { useMapStore } from '../../store/useMapStore';
import { useRoute } from '../../hooks/queries/useRoute';
import { MapRoute } from './MapRoute';

interface MapContentProps {
  userCoords: number[] | null;
  locationStatus: string;
  poisGeoJSON: any;
  onDeselect?: () => void;
}

export const MapContent = React.memo(({ 
  userCoords, 
  locationStatus, 
  poisGeoJSON,
  onDeselect
}: MapContentProps) => {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  // Selective selectors to minimize re-renders
  const selectedPoiId = useMapStore(s => s.selectedPoiId);
  const selectedCoords = useMapStore(s => s.selectedCoords);
  const recenterCount = useMapStore(s => s.recenterCount);
  const currentRoute = useMapStore(s => s.currentRoute);
  const selectPoi = useMapStore(s => s.selectPoi);
  const storeDeselect = useMapStore(s => s.deselect);

  const lastSelectionTime = useRef(0);

  // Auto-fetch route when a POI is selected
  const routeRequest = useMemo(() => {
    if (selectedPoiId && userCoords) {
      return {
        origin: { lat: userCoords[1], lng: userCoords[0] },
        destination: { poiId: selectedPoiId },
      };
    }
    return null;
  }, [selectedPoiId, userCoords]);

  useRoute(routeRequest);

  // Handle recenter trigger from store
  useEffect(() => {
    if (recenterCount > 0 && userCoords && camera.current) {
      console.log('[MapContent] Recentering to user:', userCoords);
      camera.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: 17,
        animationDuration: 1000,
        animationMode: 'flyTo',
      });
    }
  }, [recenterCount, userCoords]);

  // Handle auto-centering when a POI is selected
  useEffect(() => {
    if (selectedCoords && camera.current) {
      camera.current.setCamera({
        centerCoordinate: selectedCoords,
        zoomLevel: 17,
        animationDuration: 350, // Reduced from 600 for snappier feel
        animationMode: 'flyTo',
      });
    }
  }, [selectedCoords]);

  const onMapPress = useCallback((e: any) => {
    const now = Date.now();
    // If we just clicked a pin, ignore the map press
    if (now - lastSelectionTime.current < 400) { 
      return;
    }
    
    console.log('[MapContent] Map press detected (deselecting)');
    if (onDeselect) {
      onDeselect();
    } else {
      storeDeselect();
    }
  }, [onDeselect, storeDeselect]);

  const onSourcePress = useCallback((event: any) => {
    const feature = event.features[0];
    if (feature?.properties && feature.geometry.type === 'Point') {
      const poiId = Number(feature.properties.id);
      console.log('[MapContent] Source press detected for ID:', poiId);
      lastSelectionTime.current = Date.now();
      selectPoi(poiId, feature.geometry.coordinates);
    }
  }, [selectPoi]);

  // Filter out the selected POI from the background layer
  const backgroundPois = useMemo(() => {
    if (!poisGeoJSON) return null;
    return {
      ...poisGeoJSON,
      features: poisGeoJSON.features.filter((f: any) => f.properties.id !== selectedPoiId)
    };
  }, [poisGeoJSON, selectedPoiId]);

  const selectedFeature = useMemo(() => {
    if (!selectedPoiId || !poisGeoJSON) return null;
    return poisGeoJSON.features.find((f: any) => f.properties.id === selectedPoiId);
  }, [selectedPoiId, poisGeoJSON]);

  return (
    <MapLibreGL.MapView
      style={[{ flex: 1, backgroundColor: theme.colors.background }]}
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
          centerCoordinate: [2.1060698, 41.3863034],
          zoomLevel: 17,
        }}
      />

      {locationStatus === 'granted' ? (
        <MapLibreGL.UserLocation visible={true} renderMode="normal" />
      ) : null}

      <MapRoute route={currentRoute} />

      {/* Background Pins Layer (Visual only, interactions handled by MarkerView below) */}
      {backgroundPois ? (
        <MapLibreGL.ShapeSource
          id="poisSource"
          shape={backgroundPois}
        >
          <MapLibreGL.CircleLayer
            id="poiCircles"
            style={{
              circleRadius: 15,
              circleColor: 'rgba(255, 59, 48, 0.15)',
              circleStrokeWidth: 1,
              circleStrokeColor: 'rgba(255, 59, 48, 0.3)',
            }}
          />
        </MapLibreGL.ShapeSource>
      ) : null}

      {/* Interactive POI Markers */}
      {poisGeoJSON?.features ? poisGeoJSON.features.map((feature: any) => {
        const poiId = Number(feature.properties.id);
        if (poiId === Number(selectedPoiId)) return null;
        
        const metadata = getCategoryMetadata(feature.properties.category);

        return (
          <MapLibreGL.MarkerView 
            key={feature.properties.id} 
            coordinate={feature.geometry.coordinates}
          >
            <Pressable 
              onPress={() => {
                console.log('[MapContent] MarkerView pressed for ID:', poiId);
                lastSelectionTime.current = Date.now();
                selectPoi(poiId, feature.geometry.coordinates);
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                backgroundColor: 'rgba(255, 59, 48, 0.2)',
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              })}
            >
              <Feather 
                name={metadata.icon as any} 
                size={16} 
                color="white" 
              />
            </Pressable>
          </MapLibreGL.MarkerView>
        );
      }) : null}

      {/* Selected Pin (Custom View) */}
      {selectedFeature ? (
        <MapLibreGL.MarkerView 
          id="selectedPin"
          coordinate={selectedFeature.geometry.coordinates} 
          anchor={{ x: 0.5, y: 1 }}
        >
          <Pressable 
            onPress={() => {
              console.log('[MapContent] Selected pin pressed again');
              selectPoi(Number(selectedFeature.properties.id), selectedFeature.geometry.coordinates);
            }}
            className="items-center" 
            style={{ width: 40, height: 50 }}
          >
            <View 
              style={{ 
                backgroundColor: '#FF3B30', 
                width: 36, 
                height: 36, 
                borderRadius: 18, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'white',
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                zIndex: 10,
              }}
            >
              <Feather 
                name={getCategoryMetadata(selectedFeature.properties.category).icon as any} 
                size={20} 
                color="white" 
              />
            </View>
            <View 
              style={{ 
                width: 0, 
                height: 0,
                borderStyle: 'solid',
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderTopWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: 'white',
                marginTop: -2,
                zIndex: 9,
              }} 
            />
          </Pressable>
        </MapLibreGL.MarkerView>
      ) : null}
    </MapLibreGL.MapView>
  );
});
