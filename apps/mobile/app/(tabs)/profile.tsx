import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authService } from '../../src/services/authService';
import { colors } from '../../src/styles/colors';
import { useRouter } from 'expo-router';
import { SettingItem } from '../../src/components/ui/SettingItem';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { user, token, activeTicket, tickets, logout, setAuth } = useAuthStore();
  const router = useRouter();
  
  // Local state for toggles and wizard
  const [avoidStairs, setAvoidStairs] = useState(user?.avoidStairs ?? false);
  const [avoidGrandstands, setAvoidGrandstands] = useState(user?.avoidGrandstands ?? false);
  const [avoidSlopes, setAvoidSlopes] = useState(user?.avoidSlopes ?? false);
  
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setAvoidStairs(user.avoidStairs ?? false);
      setAvoidGrandstands(user.avoidGrandstands ?? false);
      setAvoidSlopes(user.avoidSlopes ?? false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  const savePreferences = async (prefs: { avoidStairs?: boolean, avoidGrandstands?: boolean, avoidSlopes?: boolean }) => {
    if (!token || !user) return;
    
    setIsSaving(true);
    try {
      const updatedUser = await authService.updateMe(prefs, token);
      setAuth(token, updatedUser);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'No se han podido guardar las preferencias.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWizardNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    } else {
      savePreferences({ avoidStairs, avoidGrandstands, avoidSlopes });
      setShowWizard(false);
      setWizardStep(1);
    }
  };

  const handleToggle = (key: 'avoidStairs' | 'avoidGrandstands' | 'avoidSlopes', value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const prefs = { 
      avoidStairs: key === 'avoidStairs' ? value : avoidStairs,
      avoidGrandstands: key === 'avoidGrandstands' ? value : avoidGrandstands,
      avoidSlopes: key === 'avoidSlopes' ? value : avoidSlopes 
    };
    
    // Update local state immediately for UI responsiveness
    if (key === 'avoidStairs') setAvoidStairs(value);
    if (key === 'avoidGrandstands') setAvoidGrandstands(value);
    if (key === 'avoidSlopes') setAvoidSlopes(value);
    
    savePreferences(prefs);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="pt-12 pb-8 items-center">
          <View className="mb-4">
            <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center border-2 border-primary">
              <Feather name="user" size={48} color={colors.primary} />
            </View>
          </View>
          <Text className="text-white text-2xl font-black mb-1">
            {user ? user.fullName : 'Guest Account'}
          </Text>
          <Text className="text-muted text-base">
            {user ? `@${user.fullName.replace(/\s+/g, '').toLowerCase()}` : 'Not logged in'}
          </Text>
          
          <View className="flex-row gap-x-3 mt-6">
            <Pressable 
              className="bg-primary py-3 px-8 rounded-full active:opacity-90"
            >
              <Text className="text-white font-bold text-base">Editar Perfil</Text>
            </Pressable>
          </View>
        </View>

        <View className="px-4 mb-8 mt-4">
          {/* List Section */}
          <View className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            
            <SettingItem 
              label="Billetera de Entradas"
              icon="tag"
              secondaryText={activeTicket ? `Activa: ${activeTicket.code}` : undefined}
              onPress={() => {
                if (tickets && tickets.length > 0) {
                  Alert.alert('Tickets', `Tienes ${tickets.length} entradas. Activa: ${activeTicket?.code}`);
                } else {
                  router.push('/scan' as any);
                }
              }}
            />

            <SettingItem 
              label={user?.hasTicket ? 'Entrada Activa ✓' : 'Vincular Entrada'}
              icon="maximize"
              onPress={() => {
                if (user && !user.hasTicket) {
                  Alert.alert(
                    "Vincular Entrada",
                    "Elige un método para vincular tu entrada",
                    [
                      { text: "Escanear QR", onPress: () => router.push('/scan' as any) },
                      {
                        text: "Simular Escaneo",
                        onPress: async () => {
                          const success = await useAuthStore.getState().claimTicket('CIRCUIT25');
                          if (success) Alert.alert('Éxito', 'Entrada vinculada correctamente!');
                          else Alert.alert('Error', 'No se ha podido vincular la entrada');
                        }
                      },
                      { text: "Cancelar", style: "cancel" }
                    ]
                  );
                } else if (user?.hasTicket) {
                  Alert.alert('Aviso', 'Ya tienes una entrada activa vinculada.');
                } else {
                  router.push('/scan' as any);
                }
              }}
            />

            <View className="px-5 py-3 bg-black/20">
              <Text className="text-muted text-xs font-bold uppercase tracking-wider">Preferencias de cuenta</Text>
            </View>

            <SettingItem 
              label="Configurar Preferencias"
              icon="settings"
              secondaryText="Ajustar rutas y accesibilidad"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowWizard(true);
              }}
              iconBgColor="rgba(255, 59, 48, 0.1)"
            />

            <SettingItem 
              label="Tema"
              icon="package"
              iconBgColor="rgba(255, 255, 255, 0.1)"
              onPress={() => Alert.alert('Info', 'Próximamente disponible!')}
            />

            <SettingItem 
              label="Cerrar sesión"
              icon="log-out"
              destructive
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>

      {/* Preferences Wizard Modal */}
      <Modal
        visible={showWizard}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWizard(false)}
      >
        <View className="flex-1 bg-black/90 justify-end">
          <View className="bg-[#1C1C1E] rounded-t-[40px] p-8 pb-12 border-t border-white/10">
            <View className="items-center mb-8">
              <View className="w-12 h-1.5 bg-white/20 rounded-full mb-8" />
              
              <View className="flex-row gap-x-2 mb-8">
                <View className={`h-1.5 rounded-full flex-1 ${wizardStep >= 1 ? 'bg-primary' : 'bg-white/10'}`} />
                <View className={`h-1.5 rounded-full flex-1 ${wizardStep >= 2 ? 'bg-primary' : 'bg-white/10'}`} />
                <View className={`h-1.5 rounded-full flex-1 ${wizardStep >= 3 ? 'bg-primary' : 'bg-white/10'}`} />
              </View>
            </View>

            <Animated.View 
              key={wizardStep}
              entering={FadeInDown.duration(400)}
              className="items-center"
            >
              {wizardStep === 1 && (
                <View className="items-center w-full">
                  <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-6">
                    <MaterialCommunityIcons name="stairs" size={40} color={colors.primary} />
                  </View>
                  <Text className="text-white text-2xl font-bold text-center mb-4">¿Evitar escaleras?</Text>
                  <Text className="text-muted text-center mb-10 text-base">Priorizaremos rutas con rampas y ascensores para tu comodidad.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { setAvoidStairs(false); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${!avoidStairs ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${!avoidStairs ? 'text-white' : 'text-white/60'}`}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { setAvoidStairs(true); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${avoidStairs ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${avoidStairs ? 'text-white' : 'text-white/60'}`}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {wizardStep === 2 && (
                <View className="items-center w-full">
                  <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-6">
                    <MaterialCommunityIcons name="layers-outline" size={40} color={colors.primary} />
                  </View>
                  <Text className="text-white text-2xl font-bold text-center mb-4">¿Evitar graderías?</Text>
                  <Text className="text-muted text-center mb-10 text-base">Evitaremos pasar por zonas de gradas siempre que sea posible.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { setAvoidGrandstands(false); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${!avoidGrandstands ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${!avoidGrandstands ? 'text-white' : 'text-white/60'}`}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { setAvoidGrandstands(true); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${avoidGrandstands ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${avoidGrandstands ? 'text-white' : 'text-white/60'}`}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {wizardStep === 3 && (
                <View className="items-center w-full">
                  <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-6">
                    <MaterialCommunityIcons name="slope-uphill" size={40} color={colors.primary} />
                  </View>
                  <Text className="text-white text-2xl font-bold text-center mb-4">¿Evitar pendientes?</Text>
                  <Text className="text-muted text-center mb-10 text-base">Buscaremos los caminos más llanos dentro del recinto.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { setAvoidSlopes(false); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${!avoidSlopes ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${!avoidSlopes ? 'text-white' : 'text-white/60'}`}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { setAvoidSlopes(true); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${avoidSlopes ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${avoidSlopes ? 'text-white' : 'text-white/60'}`}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Animated.View>
            
            <Pressable 
              onPress={() => setShowWizard(false)}
              className="mt-8 items-center"
            >
              <Text className="text-white/40 font-medium">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {isSaving && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}
