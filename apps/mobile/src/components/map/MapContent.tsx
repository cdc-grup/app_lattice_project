import React, { useRef, useEffect, useCallback } from 'react';
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
}

export const MapContent = React.memo(({ 
  userCoords, 
  locationStatus, 
  poisGeoJSON 
}: MapContentProps) => {
  const camera = useRef<MapLibreGL.CameraRef>(null);
  const { selectedPoiId, selectedCoords, recenterCount, selectPoi, deselect } = useMapStore();
  const isSelectingMarker = useRef(false);

  // Handle recenter trigger from store
  useEffect(() => {
    if (recenterCount > 0 && userCoords && camera.current) {
      camera.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: 18,
        animationDuration: 1000,
        animationMode: 'flyTo',
      });
    }
  }, [recenterCount, userCoords]);

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
      style={[{ flex: 1, backgroundColor: theme.colors.background }]}
      mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      logoEnabled={false}
      attributionEnabled={false}
      compassEnabled={false}
      rotateEnabled={true}
      zoomEnabled={true}
      pitchEnabled={true}
      onPress={onMapPress}
      surfaceView={true}
    >
      <MapLibreGL.Camera
        ref={camera}
        minZoomLevel={12}
        defaultSettings={{
          centerCoordinate: [2.1060698, 41.3863034],
          zoomLevel: 19,
        }}
      />

      {locationStatus === 'granted' && (
        <MapLibreGL.UserLocation visible={true} renderMode="normal" />
      )}

      {poisGeoJSON?.features.map((feature: any) => (
        <PoiMarker
          key={feature.properties.id}
          feature={feature}
          isSelected={feature.properties.id === selectedPoiId}
          onPress={() => selectPoi(feature.properties.id, feature.geometry.coordinates)}
        />
      ))}
    </MapLibreGL.MapView>
  );
});

const PoiMarker = React.memo(({ feature, isSelected, onPress }: any) => {
  const metadata = getCategoryMetadata(feature.properties.category);
  
  if (isSelected) {
    return (
      <MapLibreGL.MarkerView coordinate={feature.geometry.coordinates} anchor={{ x: 0.5, y: 1 }}>
        <Pressable onPress={onPress} className="items-center active:opacity-90">
          {/* Classic Pin Body */}
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
              zIndex: 2,
            }}
          >
            <Feather name={metadata.icon as any} size={20} color="white" />
          </View>
          {/* Pin Tip/Tail */}
          <View 
            style={{ 
              width: 0, 
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: 6,
              borderRightWidth: 6,
              borderTopWidth: 10,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: 'white', // Tail matches border color
              marginTop: -2,
              zIndex: 1,
            }} 
          />
        </Pressable>
      </MapLibreGL.MarkerView>
    );
  }

  return (
    <MapLibreGL.MarkerView coordinate={feature.geometry.coordinates}>
      <Pressable 
        onPress={onPress}
        className="bg-white/10 w-[30px] h-[30px] rounded-full items-center justify-center border border-white/20 active:opacity-70"
      >
        <Feather name={metadata.icon as any} size={16} color="rgba(255, 255, 255, 0.8)" />
      </Pressable>
    </MapLibreGL.MarkerView>
  );
});
