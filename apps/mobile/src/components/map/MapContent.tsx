import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';
import { getCategoryIcon, getCategoryMetadata } from '../../utils/poiUtils';
import { useMapStore } from '../../store/useMapStore';

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
  const { selectedPoiId, selectedCoords, recenterCount, selectPoi, deselect: storeDeselect } = useMapStore();
  const lastSelectionTime = useRef(0);

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
      console.log('[MapContent] Centering to POI:', selectedCoords);
      camera.current.setCamera({
        centerCoordinate: selectedCoords,
        zoomLevel: 17,
        animationDuration: 600,
        animationMode: 'flyTo',
      });
    }
  }, [selectedCoords]);

  const onMapPress = useCallback((e: any) => {
    const now = Date.now();
    // If we just clicked a pin, ignore the map press
    if (now - lastSelectionTime.current < 500) {
      return;
    }
    
    console.log('[MapContent] Map press detected, deselecting');
    if (onDeselect) {
      onDeselect();
    } else {
      storeDeselect();
    }
  }, [onDeselect, storeDeselect]);

  const onSourcePress = useCallback((event: any) => {
    const feature = event.features[0];
    if (feature?.properties && feature.geometry.type === 'Point') {
      console.log('[MapContent] Source press detected for:', feature.properties.id);
      lastSelectionTime.current = Date.now();
      selectPoi(feature.properties.id, feature.geometry.coordinates);
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

      {locationStatus === 'granted' && (
        <MapLibreGL.UserLocation visible={true} renderMode="normal" />
      )}

      {/* Background Pins Layer (Fast & Reliable) */}
      {backgroundPois && (
        <MapLibreGL.ShapeSource
          id="poisSource"
          shape={backgroundPois}
          onPress={onSourcePress}
          hitbox={{ width: 44, height: 44 }} // Apple Maps like hitbox
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
          <MapLibreGL.SymbolLayer
            id="poiIcons"
            style={{
              iconImage: ['get', 'category'], // Note: requires images to be loaded or using a fonts based approach
              // Since we use Feather icons in Views, we'll stick to a mixed approach:
              // ShapeSource detects the tap, but we still render individual components if needed.
              // HOWEVER, for maximum performance, SymbolLayer is best.
              // For now, let's use ShapeSource for tap detection over the whole set.
            }}
          />
        </MapLibreGL.ShapeSource>
      )}

      {/* Render individual unselected markers for the icons (visual only, taps handled by ShapeSource) */}
      {poisGeoJSON?.features.map((feature: any) => {
        if (feature.properties.id === selectedPoiId) return null;
        return (
          <MapLibreGL.MarkerView key={feature.properties.id} coordinate={feature.geometry.coordinates}>
            <View 
              pointerEvents="none"
              style={{
                backgroundColor: 'rgba(255, 59, 48, 0.15)',
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255, 59, 48, 0.3)',
              }}
            >
              <Feather 
                name={getCategoryMetadata(feature.properties.category).icon as any} 
                size={16} 
                color="rgba(255, 255, 255, 0.9)" 
              />
            </View>
          </MapLibreGL.MarkerView>
        );
      })}

      {/* Selected Pin (Custom View) */}
      {selectedFeature && (
        <MapLibreGL.MarkerView 
          id="selectedPin"
          coordinate={selectedFeature.geometry.coordinates} 
          anchor={{ x: 0.5, y: 1 }}
        >
          <View className="items-center" style={{ width: 40, height: 50 }}>
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
          </View>
        </MapLibreGL.MarkerView>
      )}
    </MapLibreGL.MapView>
  );
});
