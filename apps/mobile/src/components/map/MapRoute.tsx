import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { RouteGeoJSON } from '../../types';

interface MapRouteProps {
  route: RouteGeoJSON | null;
}

export const MapRoute = React.memo(function MapRoute({ route }: MapRouteProps) {
  if (!route) return null;

  return (
    <MapLibreGL.ShapeSource id="routeSource" shape={route}>
      <MapLibreGL.LineLayer
        id="routeFill"
        style={{
          lineColor: '#00FF9D', // Neon green
          lineWidth: 5,
          lineJoin: 'round',
          lineCap: 'round',
          lineOpacity: 0.8,
        }}
      />
      <MapLibreGL.LineLayer
        id="routeGlow"
        style={{
          lineColor: '#00FF9D',
          lineWidth: 10,
          lineJoin: 'round',
          lineCap: 'round',
          lineOpacity: 0.2,
          lineBlur: 5,
        }}
      />
    </MapLibreGL.ShapeSource>
  );
});

MapRoute.displayName = 'MapRoute';
