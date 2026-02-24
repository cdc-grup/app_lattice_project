import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export type PermissionStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'blocked';

export const useLocationPermission = () => {
  const [status, setStatus] = useState<PermissionStatus>('idle');

  const requestPermission = useCallback(async () => {
    setStatus('loading');
    try {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setStatus('granted');
        return true;
      }

      const { status: newStatus, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      if (newStatus === 'granted') {
        setStatus('granted');
        return true;
      }

      if (!canAskAgain) {
        setStatus('blocked');
        Alert.alert(
          'Permisos de ubicación',
          'Has denegado los permisos de ubicación de forma permanente. Por favor, actívalos en los ajustes de la aplicación para poder orientarte en el circuito.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }

      setStatus('denied');
      return false;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setStatus('denied');
      return false;
    }
  }, []);

  useEffect(() => {
    // Check permission on mount
    (async () => {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      if (existingStatus === 'granted') {
        setStatus('granted');
      }
    })();
  }, []);

  return { status, requestPermission };
};
