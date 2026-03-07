import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSaveLocation } from '../../hooks/queries/useSavedLocations';
import { Alert } from 'react-native';

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  flex?: number;
}

const ActionButton = ({ icon, label, onPress, flex = 1 }: ActionButtonProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
        styles.actionButton,
        { flex },
        pressed && { backgroundColor: 'rgba(255, 255, 255, 0.18)', transform: [{ scale: 0.98 }] }
    ]}
  >
    <View style={styles.buttonContent}>
        <View style={styles.iconCircle}>
            <Feather name={icon as any} size={20} color="#FF3B30" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </View>
  </Pressable>
);

export const SheetFooterActions = () => {
  const saveLocation = useSaveLocation();

  const handleFixPin = () => {
    console.log('[SheetFooterActions] Fix pin pressed');
    // Alert.prompt is iOS only. For cross-platform we use Alert.alert or a custom modal.
    Alert.alert(
      "Guardar ubicación",
      "¿Quieres guardar esta ubicación en tus guías?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Guardar", 
          onPress: () => {
            console.log('[SheetFooterActions] Saving pinned location...');
            saveLocation.mutate({
              label: "Mi marcador",
              latitude: 41.570,
              longitude: 2.261,
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ActionButton 
          icon="share" 
          label="Enviar ubicación" 
          onPress={() => console.log('Share location')} 
        />
        <ActionButton 
          icon="map-pin" 
          label="Fijar pin aquí" 
          onPress={handleFixPin} 
        />
      </View>
      
      <View style={styles.termsContainer}>
        <Pressable style={({ pressed }) => [styles.termsButton, pressed && { opacity: 0.6 }]}>
            <Text style={styles.termsText}>Términos y condiciones</Text>
            <Feather name="chevron-right" size={12} color="rgba(255, 255, 255, 0.2)" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingBottom: 60,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  termsContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  termsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    marginRight: 4,
  }
});
