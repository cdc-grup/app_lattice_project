import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { Feather } from '@expo/vector-icons';
import Animated, { SharedValue, useAnimatedStyle, interpolate, Extrapolate, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIPOI } from '../../types/models/poi';
import { RouteGeoJSON } from '../../types';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useMapStore } from '../../store/useMapStore';
import { useSavedLocations, useSaveLocation, useDeleteSavedLocation } from '../../hooks/queries/useSavedLocations';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Hoist Intl for performance (js-hoist-intl)
const durationFormatter = new Intl.NumberFormat('es-ES', {
  style: 'unit',
  unit: 'minute',
  unitDisplay: 'short',
});

const distanceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'unit',
  unit: 'meter',
  unitDisplay: 'short',
});

const kmFormatter = new Intl.NumberFormat('es-ES', {
  style: 'unit',
  unit: 'kilometer',
  unitDisplay: 'short',
  maximumFractionDigits: 1,
});

interface PoiDetailSheetProps {
  poi: UIPOI | null;
  route: RouteGeoJSON | null;
  onClose: () => void;
  translateY: SharedValue<number>;
}

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[style, styles.solidBackground]}>
      <View style={styles.premiumBorder} />
    </View>
  );
};

export const PoiDetailSheet = React.forwardRef<BottomSheet, PoiDetailSheetProps>(({ 
  poi, 
  route,
  onClose,
  translateY 
}, ref) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const setNavigating = useMapStore(s => s.setNavigating);
  const { data: savedData } = useSavedLocations();
  const saveLocation = useSaveLocation();
  const deleteLocation = useDeleteSavedLocation();

  const isSaved = React.useMemo(() => {
    if (!savedData?.features || !poi) return false;
    return savedData.features.some((f: any) => 
      f.properties.label === poi.name || 
      (Math.abs(f.geometry.coordinates[0] - poi.geometry.coordinates[0]) < 0.0001 &&
       Math.abs(f.geometry.coordinates[1] - poi.geometry.coordinates[1]) < 0.0001)
    );
  }, [savedData, poi]);

  // Check if the current POI *is* a saved marker (different from just being "in favorites")
  const isSelectedSaved = React.useMemo(() => {
    if (!savedData?.features || !poi) return false;
    // If it comes from savedData, it will match by ID (saved marker ID != POI ID usually)
    // But in MapIndex we pass the marker as a POI object
    return savedData.features.some((f: any) => Number(f.properties.id) === Number(poi.id));
  }, [savedData, poi]);

  const snapPoints = React.useMemo(() => [
    insets.bottom + 260, // Collapsed
    SCREEN_HEIGHT - insets.top - 40 // Expanded
  ], [insets.bottom, insets.top]);

  const formattedDuration = React.useMemo(() => {
    if (!route?.properties.durationEstimate) return '--';
    const mins = Math.round(route.properties.durationEstimate / 60);
    return durationFormatter.format(mins || 1);
  }, [route]);

  const formattedDistance = React.useMemo(() => {
    if (!route?.properties.distance) return '--';
    const dist = route.properties.distance;
    return dist >= 1000 
      ? kmFormatter.format(dist / 1000)
      : distanceFormatter.format(dist);
  }, [route]);

  const handleToggleSave = () => {
    console.log('[PoiDetailSheet] Toggle save pressed for:', poi?.name);
    if (!poi) return;
    if (isSaved) {
      const savedItem = savedData.features.find((f: any) => f.properties.label === poi.name);
      if (savedItem) {
        console.log('[PoiDetailSheet] Deleting saved location:', savedItem.properties.id);
        deleteLocation.mutate(savedItem.properties.id);
      }
    } else {
      console.log('[PoiDetailSheet] Saving new location:', poi.name);
      saveLocation.mutate({
        label: poi.name,
        latitude: poi.geometry.coordinates[1],
        longitude: poi.geometry.coordinates[0],
      });
    }
  };

  if (!poi) return null;

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
      handleIndicatorStyle={styles.handleIndicator}
      animatedPosition={translateY}
      enablePanDownToClose
      onClose={onClose}
    >
      <View style={styles.container}>
        {/* Apple Maps Style Header */}
        <View style={styles.header}>
          <Animated.View 
            entering={FadeInUp.delay(100).springify()}
            style={styles.headerTitleContainer}
          >
            <Text style={styles.title} numberOfLines={1}>{poi.name}</Text>
            <Text style={styles.subtitle}>
              {isSelectedSaved ? 'Lugar Guardado' : (poi.category || 'Punto de interés')}
            </Text>
          </Animated.View>
          <View style={styles.headerActions}>
            <Pressable 
              onPress={() => {
                Haptics.selectionAsync();
                onClose();
              }} 
              style={({ pressed }) => [styles.headerIcon, styles.closeIcon, pressed && { opacity: 0.7 }]}
            >
              <Feather name="x" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {/* Action Buttons - Moved to top for visibility */}
          <Animated.View 
            entering={FadeInUp.delay(200).springify()}
            style={styles.actionRow}
          >
            <Pressable 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setNavigating(true);
              }}
              style={({ pressed }) => [
                styles.driveButton, 
                pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
              ]}
            >
              <View style={styles.driveButtonContent}>
                <Feather name="navigation" size={22} color="white" />
                <View style={styles.driveButtonTextContainer}>
                  <Text style={styles.driveButtonTitle}>INDICACIONES</Text>
                  <Text style={styles.driveButtonSubtitle}>{formattedDuration}</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {poi.description && (
            <Text style={styles.descriptionText}>{poi.description}</Text>
          )}

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ocupación</Text>
              <Text style={[
                styles.infoValue, 
                { color: poi.crowdLevel === 'high' || poi.crowdLevel === 'blocked' ? '#E10600' : 
                         poi.crowdLevel === 'moderate' ? '#FF9500' : '#30D158' }
              ]}>
                {poi.crowdLevel === 'low' ? 'Baja' : 
                 poi.crowdLevel === 'moderate' ? 'Media' : 
                 poi.crowdLevel === 'high' ? 'Alta' :
                 poi.crowdLevel === 'blocked' ? 'Cerrado' : '--'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Accesible</Text>
              <View style={styles.ratingRow}>
                <Feather 
                  name={poi.isWheelchairAccessible ? "check-circle" : "x-circle"} 
                  size={14} 
                  color={poi.isWheelchairAccessible ? "#30D158" : "#E10600"} 
                />
                <Text style={styles.infoValue}> {poi.isWheelchairAccessible ? 'Sí' : 'No'}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Prioridad</Text>
              <View style={styles.paymentRow}>
                <Feather 
                  name="user-check" 
                  size={14} 
                  color={poi.hasPriorityLane ? "#30D158" : "rgba(255,255,255,0.4)"} 
                />
                <Text style={[styles.infoValue, { color: poi.hasPriorityLane ? '#30D158' : 'white' }]}>
                  {poi.hasPriorityLane ? ' Carril' : ' No'}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Distancia</Text>
              <View style={styles.distRow}>
                <Feather name="navigation-2" size={14} color="white" style={{ transform: [{ rotate: '45deg' }] }} />
                <Text style={styles.infoValue}> {formattedDistance}</Text>
              </View>
            </View>
          </View>

          {/* Photos */}
          <View style={styles.photosSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {poi.images && poi.images.length > 0 ? (
                poi.images.map((img, i) => (
                  <View key={i} style={styles.photoPlaceholder} /> // In a real app we'd use <Image source={{uri: img}} />
                ))
              ) : (
                [1, 2, 3].map((i) => (
                  <View key={i} style={styles.photoPlaceholder} />
                ))
              )}
            </ScrollView>
          </View>

          {/* User Specific Note if applicable */}
          {user?.avoidStairs && !poi.isWheelchairAccessible && (
            <View className="mt-6 flex-row items-center p-4 bg-[#E10600]/10 rounded-2xl border border-[#E10600]/20">
              <Feather name="alert-circle" size={20} color="#E10600" />
              <Text className="ml-3 text-[#E10600] font-semibold flex-1">
                Atención: Este sitio puede no ser accesible según tus preferencias de movilidad.
              </Text>
            </View>
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  solidBackground: {
    backgroundColor: '#1C1C1E', // Match profile wizard background
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Matches w-12 h-1.5 bg-white/20
    width: 48,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 8,
  },
  driveButton: {
    backgroundColor: '#E10600',
    height: 64,
    borderRadius: 14,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  driveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driveButtonTextContainer: {
    marginLeft: 16,
  },
  driveButtonTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  driveButtonSubtitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 0,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  infoItem: {
    width: '25%',
    alignItems: 'center',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photosSection: {
    marginTop: 20,
  },
  photoPlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginRight: 12,
  },

  premiumBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    pointerEvents: 'none',
  },
});
