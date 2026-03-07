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

const ActionButton = ({ icon, label, onPress, flex = 1 }: { icon: string, label: string, onPress: () => void, flex?: number }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
        styles.actionButton,
        { flex },
        pressed && { backgroundColor: 'rgba(255, 255, 255, 0.15)', transform: [{ scale: 0.96 }] }
    ]}
  >
    <View style={styles.buttonContent}>
        <View style={styles.iconCircle}>
            <Feather name={icon as any} size={24} color="#E10600" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </View>
  </Pressable>
);

interface SheetFooterActionsProps {
  onFixPin: () => void;
}

export const SheetFooterActions = ({ onFixPin }: SheetFooterActionsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ActionButton 
          icon="share-2" 
          label="Enviar" 
          onPress={() => console.log('Share location')} 
        />
        <ActionButton 
          icon="map-pin" 
          label="Fijar pin" 
          onPress={onFixPin} 
        />
        <ActionButton 
          icon="navigation" 
          label="Planear" 
          onPress={() => console.log('Plan route')} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  }
});
