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
import { SaveLocationModal } from '../../src/components/map/SaveLocationModal';
import { SavedLocationsManager } from '../../src/components/map/SavedLocationsManager';
import { useSavedLocations, useSaveLocation } from '../../src/hooks/queries/useSavedLocations';
import { DIRECT_ACCESS_CATEGORIES } from '../../src/utils/poiUtils';
import * as Haptics from 'expo-haptics';

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

  const { data: savedData } = useSavedLocations();
  const saveLocationMutation = useSaveLocation();
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [showSavedManager, setShowSavedManager] = React.useState(false);

  const selectPoi = useMapStore(s => s.selectPoi);

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
  // Fix: Don't call this if the selected ID belongs to a saved location OR if we already have it in poisData
  const { isSelectedSaved, numericPoiId } = useMemo(() => {
    if (!selectedPoiId) return { isSelectedSaved: false, numericPoiId: null };
    
    // Check for explicit 'saved_' prefix from MapContent
    const isPrefixed = selectedPoiId.toString().startsWith('saved_');
    const rawId = isPrefixed ? selectedPoiId.toString().replace('saved_', '') : selectedPoiId;
    const numId = Number(rawId);

    // Also check if this ID (numeric) exists in savedData even if not prefixed
    const existsInSaved = savedData?.features?.some((f: any) => Number(f.properties.id) === numId) || false;

    return { 
      isSelectedSaved: isPrefixed || existsInSaved, 
      numericPoiId: isNaN(numId) ? null : numId 
    };
  }, [selectedPoiId, savedData]);

  const isAlreadyLoaded = useMemo(() => {
    if (!numericPoiId || !poisData?.features) return false;
    return poisData.features.some((f: any) => Number(f.properties.id) === numericPoiId);
  }, [numericPoiId, poisData]);

  const { data: soloPoiData, isLoading: isSoloPoiLoading } = useSinglePOI(
    (isSelectedSaved || isAlreadyLoaded) ? null : numericPoiId
  );

  const selectedPoi = useMemo(() => {
    if (!selectedPoiId || numericPoiId === null) return null;
    
    console.log('[MapIndex] Resolving selection for ID:', selectedPoiId, 'Numeric:', numericPoiId);

    // 1. Try to find it in the current filtered list (fastest)
    if (poisData) {
      const f = poisData.features.find((f: any) => Number(f.properties.id) === numericPoiId);
      if (f) return { ...f.properties, geometry: f.geometry };
    }
    
    // 2. Check in saved locations (Prioritize local saved data)
    if (savedData) {
      const f = savedData.features.find((f: any) => Number(f.properties.id) === numericPoiId);
      if (f) return { ...f.properties, name: f.properties.label, geometry: f.geometry, isSaved: true };
    }

    // 3. Fallback to the single POI fetch results
    if (soloPoiData && Number(soloPoiData.properties.id) === numericPoiId) {
      return { ...soloPoiData.properties, geometry: soloPoiData.geometry };
    }

    return null;
  }, [selectedPoiId, numericPoiId, poisData, soloPoiData, savedData]);

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
          savedLocations={savedData}
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
            <GuidesSection 
              onSeeAll={() => setShowSavedManager(true)} 
              onSelectMarker={(coords, id) => {
                selectPoi(`saved_${id}`, coords);
                // Optionally close bottom sheet if needed, but standard maps usually keep it open or snap to small
              }}
            />
            <SheetFooterActions onFixPin={() => setShowSaveModal(true)} />
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

      <SaveLocationModal 
        isVisible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        isLoading={saveLocationMutation.isPending}
        onSave={(name) => {
          // Approximate center or user coords if available
          const coords = userCoords || [2.261, 41.570];
          saveLocationMutation.mutate({
            label: name,
            latitude: coords[1],
            longitude: coords[0]
          }, {
            onSuccess: () => {
              setShowSaveModal(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          });
        }}
      />

      <SavedLocationsManager 
        isVisible={showSavedManager}
        onClose={() => setShowSavedManager(false)}
        onSelectMarker={(coords, id) => {
          selectPoi(`saved_${id}`, coords);
        }}
      />
    </View>
  );
}


export default MapIndex;

