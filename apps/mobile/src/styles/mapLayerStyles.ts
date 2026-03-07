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

  // Composite Pin Layers (Selection)
  selectedPoiPinBody: {
    circleRadius: 18,
    circleColor: '#FF3B30',
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleTranslate: [0, -18], // Move up so tip is at coordinate
  } as CircleLayerStyle,

  selectedPoiPinTip: {
    textField: '▼', // Using a triangle character for the tip
    textSize: 24,
    textColor: '#FF3B30',
    textHaloColor: 'white',
    textHaloWidth: 1,
    textOffset: [0, 0.4],
    textIgnorePlacement: true,
    textAllowOverlap: true,
    textPitchAlignment: 'map',
  } as SymbolLayerStyle,

  poiCircles: {
    circleRadius: 14,
    circleColor: '#4A4A4A', 
    circleStrokeWidth: 1.5,
    circleStrokeColor: 'white',
    circleOpacity: 0.9,
  } as CircleLayerStyle,

  poiIcons: {
    textField: ['get', 'category'],
    textSize: 14,
    textColor: 'white',
    textAllowOverlap: true,
    textIgnorePlacement: true,
  } as SymbolLayerStyle,

  poiLabels: {
    textField: ['get', 'name'],
    textSize: 11,
    textColor: 'white',
    textOffset: [0, 2],
    textOpacity: 0, 
    textHaloColor: 'rgba(0,0,0,0.8)',
    textHaloWidth: 2,
    textIgnorePlacement: false,
    textAllowOverlap: false,
  } as SymbolLayerStyle,
};
