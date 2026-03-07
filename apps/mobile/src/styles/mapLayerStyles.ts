import { LineLayerStyle, CircleLayerStyle, SymbolLayerStyle } from '@maplibre/maplibre-react-native';

export const mapLayerStyles = {
  networkLines: {
    lineColor: '#606060',
    lineWidth: 3,
  } as LineLayerStyle,

  routeFill: {
    lineColor: '#E10600',
    lineWidth: 6,
    lineJoin: 'round',
    lineCap: 'round',
  } as LineLayerStyle,

  routeGlow: {
    lineColor: '#E10600',
    lineWidth: 12,
    lineJoin: 'round',
    lineCap: 'round',
    lineBlur: 6,
  } as LineLayerStyle,

  // Composite Pin Layers (Selection)
  selectedPoiPinBody: {
    circleRadius: 18,
    circleColor: '#E10600',
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleTranslate: [0, -18], // Move up so tip is at coordinate
  } as CircleLayerStyle,

  selectedPoiPinTip: {
    textField: '▼', // Using a triangle character for the tip
    textSize: 24,
    textColor: '#E10600',
    textHaloColor: 'white',
    textHaloWidth: 1,
    textOffset: [0, 0.4],
    textIgnorePlacement: true,
    textAllowOverlap: true,
    textPitchAlignment: 'map',
  } as SymbolLayerStyle,

  // Bulk POI Layers
  poiCircles: {
    circleRadius: 16,
    circleColor: [
      'match',
      ['downcase', ['get', 'category']],
      'restaurant', '#D48806',
      'food', '#D48806',
      'parking', '#2F3E46',
      'shop', '#7209B7',
      'shopping', '#7209B7',
      'wc', '#1D3557',
      'toilet', '#1D3557',
      'restroom', '#1D3557',
      'grandstand', '#1B4332',
      'medical', '#480CA8',
      'hospital', '#480CA8',
      'gate', '#2B2D42',
      'entrance', '#2B2D42',
      'meetup_point', '#386641',
      'info', '#006466',
      '#8E8E93' // Default
    ],
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleOpacity: 0.85,
    circlePitchAlignment: 'map',
  } as CircleLayerStyle,

  savedPoiCircles: {
    circleRadius: 16,
    circleColor: '#30D158',
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleOpacity: 0.9,
  } as CircleLayerStyle,

  poiIcons: {
    iconImage: 'marker', // Requires an image 'marker' to be loaded or just use text
    iconSize: 0.6,
    iconAllowOverlap: true,
  } as SymbolLayerStyle,

  poiLabels: {
    textField: ['get', 'name'],
    textSize: 11,
    textColor: 'white',
    textOffset: [0, 2.5],
    textHaloColor: 'rgba(0,0,0,0.8)',
    textHaloWidth: 2,
    textIgnorePlacement: false,
    textAllowOverlap: false,
    textOptional: true,
  } as SymbolLayerStyle,
};
