import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { Feather } from '@expo/vector-icons';
import Animated, { SharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIPOI } from '../../types/models/poi';
import { RouteGeoJSON } from '../../types';
import { useAuthStore } from '../../hooks/useAuthStore';
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

const CustomBackground = ({ style, animatedIndex }: BottomSheetBackgroundProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(18, 18, 20, ${interpolate(
        animatedIndex.value,
        [-1, 0, 1],
        [0.4, 0.92, 1],
        Extrapolate.CLAMP
      )})`,
    };
  });

  return (
    <Animated.View style={[style, styles.blurBackground, animatedStyle]}>
      <SafeBlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.premiumBorder} />
    </Animated.View>
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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title} numberOfLines={1}>{poi.name}</Text>
            <Text style={styles.subtitle}>
              {isSelectedSaved ? 'Lugar Guardado' : (poi.category || 'Punto de interés')}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable 
              style={({ pressed }) => [styles.headerIcon, pressed && { opacity: 0.7 }]}
            >
              <Feather name="share" size={20} color="#FF3B30" />
            </Pressable>
            <Pressable 
              onPress={onClose} 
              style={({ pressed }) => [styles.headerIcon, styles.closeIcon, pressed && { opacity: 0.7 }]}
            >
              <Feather name="x" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {poi.description && (
            <Text style={styles.descriptionText}>{poi.description}</Text>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Pressable 
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
            
            <View style={styles.secondaryActions}>
                <Pressable 
                    style={({ pressed }) => [
                        styles.circleButton, 
                        pressed && { backgroundColor: 'rgba(255, 59, 48, 0.15)' }
                    ]}
                >
                    <Feather name="phone" size={20} color="#FF3B30" />
                    <Text style={styles.circleButtonText}>Llamar</Text>
                </Pressable>
                <Pressable 
                    style={({ pressed }) => [
                        styles.circleButton, 
                        pressed && { backgroundColor: 'rgba(255, 59, 48, 0.15)' }
                    ]}
                >
                    <Feather name="globe" size={20} color="#FF3B30" />
                    <Text style={styles.circleButtonText}>Sitio web</Text>
                </Pressable>
            </View>
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ocupación</Text>
              <Text style={[
                styles.infoValue, 
                { color: poi.crowdLevel === 'high' || poi.crowdLevel === 'blocked' ? '#FF3B30' : 
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
                  color={poi.isWheelchairAccessible ? "#30D158" : "#FF3B30"} 
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
            <View className="mt-6 flex-row items-center p-4 bg-[#FF3B30]/10 rounded-2xl border border-[#FF3B30]/20">
              <Feather name="alert-circle" size={20} color="#FF3B30" />
              <Text className="ml-3 text-[#FF3B30] font-semibold flex-1">
                Atención: Este sitio puede no ser accesible según tus preferencias de movilidad.
              </Text>
            </View>
          )}
        </BottomSheetScrollView>

        {/* Floating Toolbar */}
        <View style={[styles.toolbar, { bottom: insets.bottom + 20 }]}>
          <Pressable style={({ pressed }) => [styles.toolbarItem, pressed && { opacity: 0.6 }]}><Feather name="plus" size={20} color="white" /></Pressable>
          <Pressable 
            onPress={handleToggleSave}
            style={({ pressed }) => [styles.toolbarItem, pressed && { opacity: 0.6 }]}
          >
            <Feather name="star" size={20} color={isSaved ? "#FF3B30" : "white"} fill={isSaved ? "#FF3B30" : "transparent"} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.toolbarItem, pressed && { opacity: 0.6 }]}><Feather name="thumbs-up" size={20} color="white" /></Pressable>
          <Pressable style={({ pressed }) => [styles.toolbarItem, pressed && { opacity: 0.6 }]}><Feather name="more-horizontal" size={20} color="white" /></Pressable>
        </View>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  blurBackground: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handleIndicator: {
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
    width: 36,
    height: 5,
    marginTop: 2,
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
    paddingBottom: 120,
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
    backgroundColor: '#FF3B30',
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
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  circleButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButtonText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
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
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    pointerEvents: 'none',
  },
  toolbar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 56,
    backgroundColor: 'rgba(30, 30, 32, 0.95)',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  toolbarItem: {
    padding: 10,
  }
});
