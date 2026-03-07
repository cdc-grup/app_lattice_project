import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { theme } from '../../styles/theme';
import { getCategoryIcon, getCategoryMetadata } from '../../utils/poiUtils';
import { useMapStore } from '../../store/useMapStore';
import { useRoute } from '../../hooks/queries/useRoute';
import { usePathNetwork } from '../../hooks/queries/usePathNetwork';

interface MapContentProps {
  userCoords: number[] | null;
  locationStatus: string;
  poisGeoJSON: any;
  savedLocations?: any;
  onDeselect?: () => void;
}

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
    if (selectedPoiId && userCoords) {
      return {
        origin: { lat: userCoords[1], lng: userCoords[0] },
        destination: { poiId: selectedPoiId },
      };
    }
    return null;
  }, [selectedPoiId, userCoords]);

  useRoute(routeRequest);

  // Handle camera movements
  useEffect(() => {
    if (recenterCount > 0 && userCoords && camera.current) {
      camera.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: 17,
        animationDuration: 1000,
        animationMode: 'flyTo',
      });
    }
  }, [recenterCount, userCoords]);

  useEffect(() => {
    if (selectedCoords && camera.current) {
      camera.current.setCamera({
        centerCoordinate: selectedCoords,
        zoomLevel: 17,
        animationDuration: 350,
        animationMode: 'flyTo',
      });
    }
  }, [selectedCoords]);

  const onMapPress = useCallback(() => {
    const now = Date.now();
    if (now - lastSelectionTime.current < 400) return;
    
    console.log('[MapContent] V2: Map press detected (deselecting)');
    if (onDeselect) {
      onDeselect();
    } else {
      storeDeselect();
    }
  }, [onDeselect, storeDeselect]);

  const onSourcePress = useCallback((event: any) => {
    const feature = event.features[0];
    const sourceId = event.sourceId; // Detect which source was pressed
    
    if (feature?.properties && feature.geometry.type === 'Point') {
      let finalId = String(feature.properties.id);
      
      // Prefix with 'saved_' if it comes from the saved locations source
      if (sourceId === 'savedSource') {
        finalId = `saved_${finalId}`;
      }
      
      console.log(`[MapContent] Press detected for ID: ${finalId} from source: ${sourceId}`);
      lastSelectionTime.current = Date.now();
      selectPoi(finalId, feature.geometry.coordinates);
    }
  }, [selectPoi]);

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

      {/* 🟢 Background Network (Grey) */}
      {pathNetwork && (
        <MapLibreGL.ShapeSource id="networkSource" shape={pathNetwork}>
          <MapLibreGL.LineLayer
            id="networkLines"
            style={{
              lineColor: '#606060',
              lineWidth: 3,
              lineOpacity: 0.3,
            }}
          />
        </MapLibreGL.ShapeSource>
      )}

      {/* 🔴 Active Route (Red) */}
      {currentRoute && (
        <MapLibreGL.ShapeSource id="routeSource" shape={currentRoute}>
          <MapLibreGL.LineLayer
            id="routeFill"
            style={{
              lineColor: '#FF3B30',
              lineWidth: 6,
              lineJoin: 'round',
              lineCap: 'round',
              lineOpacity: 0.95,
            }}
          />
          <MapLibreGL.LineLayer
            id="routeGlow"
            style={{
              lineColor: '#FF3B30',
              lineWidth: 12,
              lineJoin: 'round',
              lineCap: 'round',
              lineOpacity: 0.2,
              lineBlur: 6,
            }}
          />
        </MapLibreGL.ShapeSource>
      )}

      {/* 📍 POIs Layer - Ultra Stable Data Driven */}
      {poisGeoJSON && (
        <MapLibreGL.ShapeSource
          id="poisSource"
          shape={poisGeoJSON}
          onPress={onSourcePress}
          hitbox={{ width: 44, height: 44 }}
        >
          {/* Selection Highlight */}
          <MapLibreGL.CircleLayer
            id="poiSelectionOuter"
            filter={['==', ['to-string', ['get', 'id']], selectedPoiId || '']}
            style={{
              circleRadius: 22,
              circleColor: '#FF3B30',
              circleOpacity: 1,
              circleStrokeWidth: 3,
              circleStrokeColor: 'white',
              circlePitchAlignment: 'map',
            }}
          />

          {/* POI circles */}
          <MapLibreGL.CircleLayer
            id="poiCircles"
            style={{
              circleRadius: 15,
              circleColor: 'rgba(255, 59, 48, 0.4)',
              circleStrokeWidth: 1.5,
              circleStrokeColor: 'white',
              circleOpacity: 0.9,
            }}
          />
          
          {/* Labels */}
          <MapLibreGL.SymbolLayer
            id="poiLabels"
            style={{
              textField: ['get', 'name'],
              textSize: 11,
              textColor: 'white',
              textOffset: [0, 2],
              textOpacity: 0.9,
              textHaloColor: 'rgba(0,0,0,0.8)',
              textHaloWidth: 2,
              textIgnorePlacement: false,
              textAllowOverlap: false,
            }}
          />
        </MapLibreGL.ShapeSource>
      )}
      {/* 📍 Saved Locations Layer (Green) */}
      {savedLocations && (
        <MapLibreGL.ShapeSource
          id="savedSource"
          shape={savedLocations}
          onPress={onSourcePress}
          hitbox={{ width: 44, height: 44 }}
        >
          {/* Selection Highlight for Saved */}
          <MapLibreGL.CircleLayer
            id="savedSelectionOuter"
            filter={['==', ['concat', 'saved_', ['to-string', ['get', 'id']]], selectedPoiId || '']}
            style={{
              circleRadius: 18,
              circleColor: '#30D158',
              circleOpacity: 1,
              circleStrokeWidth: 3,
              circleStrokeColor: 'white',
              circlePitchAlignment: 'map',
            }}
          />

          <MapLibreGL.CircleLayer
            id="savedCircles"
            style={{
              circleRadius: 12,
              circleColor: '#30D158',
              circleStrokeWidth: 2.5,
              circleStrokeColor: 'white',
              circleOpacity: 0.95,
              circlePitchAlignment: 'map',
            }}
          />
          <MapLibreGL.SymbolLayer
            id="savedLabels"
            style={{
              textField: ['get', 'label'],
              textSize: 11,
              textColor: 'white',
              textOffset: [0, 2.2],
              textHaloColor: 'rgba(0,0,0,0.85)',
              textHaloWidth: 2,
              iconAllowOverlap: true,
              textIgnorePlacement: true,
              textAllowOverlap: true,
            }}
          />
        </MapLibreGL.ShapeSource>
      )}
    </MapLibreGL.MapView>
  );
});

const styles = StyleSheet.create({});
