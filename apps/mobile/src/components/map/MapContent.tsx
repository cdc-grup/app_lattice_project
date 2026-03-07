import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

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
      console.log('[MapContent] Interaction: POI selected:', poiId);
      lastSelectionTime.current = Date.now();
      selectPoi(poiId, feature.geometry.coordinates);
    }
  }, [selectPoi]);

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
      />

      {/* Network Background (Always mounted) */}
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

      {/* Active Route (Always mounted) */}
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
            lineOpacity: currentRoute ? 0.2 : 0,
          }}
        />
      </MapLibreGL.ShapeSource>

      {/* Points of Interest (Always mounted) */}
      <MapLibreGL.ShapeSource
        id="poisSource"
        shape={poisGeoJSON || EMPTY_GEOJSON}
        onPress={onSourcePress}
        hitbox={{ width: 44, height: 44 }}
      >
        <MapLibreGL.CircleLayer
          id="poiSelectionOuter"
          filter={['==', ['get', 'id'], selectedPoiId || -1]}
          style={{
            ...mapLayerStyles.poiSelectionOuter,
            circleOpacity: selectedPoiId ? 1 : 0,
          }}
        />

        <MapLibreGL.CircleLayer
          id="poiCircles"
          style={{
            ...mapLayerStyles.poiCircles,
            circleOpacity: poisGeoJSON ? 0.9 : 0,
          }}
        />
        
        <MapLibreGL.SymbolLayer
          id="poiLabels"
          style={{
            ...mapLayerStyles.poiLabels,
            textOpacity: poisGeoJSON ? 0.9 : 0,
          }}
        />
      </MapLibreGL.ShapeSource>
    </MapLibreGL.MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
