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
  const { selectedPoiId, deselect, triggerRecenter, selectPoi } = useMapStore();
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
    console.log('[Index] selectedPoiId changed to:', selectedPoiId);
    if (selectedPoiId) {
      console.log('[Index] Opening POI detail sheet');
      // Show detail sheet, hide search sheet
      poiDetailSheetRef.current?.snapToIndex(0);
      bottomSheetRef.current?.close();
    } else {
      console.log('[Index] Closing POI detail sheet, opening search sheet');
      // Show search sheet, hide detail sheet
      poiDetailSheetRef.current?.close();
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [selectedPoiId]);

  const activeCategory = useMemo(() => {
    return categories?.find(c => c.id === activeCategoryId)?.category;
  }, [activeCategoryId, categories]);

  const { data: poisData, isLoading } = usePOIs(activeCategory);

  const selectedPoi = useMemo(() => {
    if (!selectedPoiId || !poisData) return null;
    const f = poisData.features.find((f: any) => f.properties.id === selectedPoiId);
    if (!f) return null;
    return {
      ...f.properties,
      geometry: f.geometry,
      distance: '3,5 km',
      time: '11 min'
    };
  }, [selectedPoiId, poisData]);

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
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}
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
            className="w-12 h-12 items-center justify-center rounded-full active:opacity-70 bg-black/60 border border-white/5 shadow-lg"
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
        <View className="px-4">
          <SearchBar onArPress={() => router.push('/(main)/profile')} />
          <QuickActions />
          <GuidesSection />
          <SheetFooterActions />
          <View style={{ height: 100 }} />
        </View>
      </MapBottomSheet>

      {/* POI Detail Bottom Sheet */}
      <PoiDetailSheet 
        ref={poiDetailSheetRef}
        poi={selectedPoi}
        onClose={deselect}
        translateY={poiSheetPosition}
      />
    </View>
  );
}


export default MapIndex;

