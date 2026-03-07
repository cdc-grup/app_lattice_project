import { LineLayerStyle, CircleLayerStyle, SymbolLayerStyle } from '@maplibre/maplibre-react-native';

export const mapLayerStyles = {
  networkLines: {
    lineColor: '#606060',
    lineWidth: 3,
  } as LineLayerStyle,

  routeFill: {
    lineColor: '#FF3B30',
    lineWidth: 6,
    lineJoin: 'round',
    lineCap: 'round',
  } as LineLayerStyle,

  routeGlow: {
    lineColor: '#FF3B30',
    lineWidth: 12,
    lineJoin: 'round',
    lineCap: 'round',
    lineBlur: 6,
  } as LineLayerStyle,

  poiSelectionOuter: {
    circleRadius: 22,
    circleColor: '#FF3B30',
    circleStrokeWidth: 3,
    circleStrokeColor: 'white',
    circlePitchAlignment: 'map',
  } as CircleLayerStyle,

  poiCircles: {
    circleRadius: 15,
    circleColor: 'rgba(255, 59, 48, 0.4)',
    circleStrokeWidth: 1.5,
    circleStrokeColor: 'white',
  } as CircleLayerStyle,

  poiLabels: {
    textField: ['get', 'name'],
    textSize: 11,
    textColor: 'white',
    textOffset: [0, 2],
    textOpacity: 0.9,
    textHaloColor: 'rgba(0,0,0,0.8)',
    textHaloWidth: 2,
    textIgnorePlacement: false,
    textAllowOverlap: false,
  } as SymbolLayerStyle,
};
