import React, { useMemo, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapLibreGL from '@maplibre/maplibre-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { SearchBar } from '../../src/components/SearchBar';
import { POICard } from '../../src/components/POICard';
import { colors } from '../../src/styles/colors';
import { usePOIs } from '../../src/hooks/queries/usePOIs';
import { useSinglePOI } from '../../src/hooks/queries/useSinglePOI';
import { useCategories } from '../../src/hooks/queries/useCategories';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useLocationService } from '../../src/hooks/useLocationService';
import { useCameraTilt } from '../../src/hooks/useCameraTilt';
import { AROverlay } from '../../src/components/ar/AROverlay';
import { Feather } from '@expo/vector-icons';
import { useMapStore } from '../../src/store/useMapStore';
import { MapContent } from '../../src/components/map/MapContent';
import { MapBottomSheet } from '../../src/components/map/MapBottomSheet';
import { QuickActions } from '../../src/components/map/QuickActions';
import { SearchFilters } from '../../src/components/map/SearchFilters';
import { GuidesSection } from '../../src/components/map/GuidesSection';
import { SheetFooterActions } from '../../src/components/map/SheetFooterActions';
import { DIRECT_ACCESS_CATEGORIES } from '../../src/utils/poiUtils';

// Configure MapLibre
MapLibreGL.setAccessToken(null);
MapLibreGL.Logger.setLogCallback((log) => {
  const msg = typeof log.message === 'string' ? log.message : '';
  if (msg.includes('Failed to obtain last location update') || msg.includes('Last location unavailable')) return true;
  return false;
});

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  mapContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  map: { flex: 1 },
  overlay: { 
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 90,
  },
  filtersContainer: { paddingHorizontal: 16 },
});

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

import { PoiDetailSheet } from '../../src/components/map/PoiDetailSheet';

function MapIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { coords: userCoords, status: locationStatus, requestPermission } = useLocationService();
  
  // Selective selectors to minimize re-renders
  const selectedPoiId = useMapStore(s => s.selectedPoiId);
  const deselect = useMapStore(s => s.deselect);
  const triggerRecenter = useMapStore(s => s.triggerRecenter);
  const currentRoute = useMapStore(s => s.currentRoute);

  const { data: categories } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);

  const { isVisible: isARVisible } = useCameraTilt();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const poiDetailSheetRef = useRef<BottomSheet>(null);

  // Position for the main search sheet
  const sheetPosition = useSharedValue(SCREEN_HEIGHT);
  // Position for the POI detail sheet
  const poiSheetPosition = useSharedValue(SCREEN_HEIGHT);

  // Active sheet position for the location button to track
  const activePosition = useMemo(() => {
    return selectedPoiId ? poiSheetPosition : sheetPosition;
  }, [selectedPoiId, poiSheetPosition, sheetPosition]);

  // Handle POI selection changes
  React.useEffect(() => {
    if (selectedPoiId) {
      // Show detail sheet, hide search sheet
      poiDetailSheetRef.current?.snapToIndex(0);
      bottomSheetRef.current?.close();
    } else {
      // Show search sheet, hide detail sheet
      poiDetailSheetRef.current?.close();
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [selectedPoiId]);

  const activeCategory = useMemo(() => {
    if (!activeCategoryId) return undefined;
    return categories?.find(c => c.id === activeCategoryId)?.category;
  }, [activeCategoryId, categories]);

  const { data: poisData, isLoading } = usePOIs(activeCategory);
  
  // Use useSinglePOI hook for robust single POI fetching (fallback for filters)
  const { data: soloPoiData, isLoading: isSoloPoiLoading } = useSinglePOI(selectedPoiId);

  const selectedPoi = useMemo(() => {
    if (!selectedPoiId) return null;
    
    const idToMatch = Number(selectedPoiId);
    console.log('[MapIndex] Looking for selected POI:', idToMatch);

    // 1. Try to find it in the current filtered list (fastest)
    if (poisData) {
      const f = poisData.features.find((f: any) => Number(f.properties.id) === idToMatch);
      if (f) return { ...f.properties, geometry: f.geometry };
    }
    
    // 2. Fallback to the single POI fetch results
    if (soloPoiData && Number(soloPoiData.properties.id) === idToMatch) {
      return { ...soloPoiData.properties, geometry: soloPoiData.geometry };
    }

    return null;
  }, [selectedPoiId, poisData, soloPoiData]);

  const handleRecenter = useCallback(async () => {
    await requestPermission();
    triggerRecenter();
  }, [requestPermission, triggerRecenter]);

  const rRecenterButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: activePosition.value - SCREEN_HEIGHT - 80 }],
    };
  });

  return (
    <View className="flex-1 overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Map Content (Full Screen) */}
      <View style={StyleSheet.absoluteFill}>
        <MapContent 
          userCoords={userCoords}
          locationStatus={locationStatus}
          poisGeoJSON={poisData}
          onDeselect={deselect}
        />
        <AROverlay 
          isVisible={isARVisible} 
          onExitAR={() => {}}
        />
        {isLoading ? (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : null}
      </View>

      {/* Floating Recenter Button (Synced) */}
      <Animated.View 
        pointerEvents="box-none" 
        style={[
          styles.overlay, 
          { bottom: 0 }, 
          rRecenterButtonStyle
        ]}
      >
        <View pointerEvents="auto" className="items-end px-4 mb-4">
          <Pressable 
            onPress={handleRecenter}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
            className="w-12 h-12 items-center justify-center rounded-full bg-black/60 border border-white/5 shadow-lg"
          >
            <Feather name="navigation" size={24} color="white" />
          </Pressable>
        </View>
      </Animated.View>

      {/* Main Search Bottom Sheet */}
      <MapBottomSheet 
        ref={bottomSheetRef}
        translateY={sheetPosition}
      >
        <View>
          <SearchBar onArPress={() => router.push('/(main)/profile')} />
          <SearchFilters />
          <View className="px-4">
            <GuidesSection />
            <SheetFooterActions />
            <View style={{ height: 100 }} />
          </View>
        </View>
      </MapBottomSheet>

      {/* POI Detail Bottom Sheet */}
      <PoiDetailSheet 
        ref={poiDetailSheetRef}
        poi={selectedPoi}
        route={currentRoute}
        onClose={deselect}
        translateY={poiSheetPosition}
      />
    </View>
  );
}


export default MapIndex;

