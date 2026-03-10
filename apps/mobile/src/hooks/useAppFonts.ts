import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts as useOutfitFonts,
} from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts as useJakartaFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { typography } from '../styles/typography';

export function useAppFonts() {
  const [outfitLoaded, outfitError] = useOutfitFonts({
    [typography.primary.regular]: Outfit_400Regular,
    [typography.primary.medium]: Outfit_500Medium,
    [typography.primary.semibold]: Outfit_600SemiBold,
    [typography.primary.bold]: Outfit_700Bold,
  });

  const [jakartaLoaded, jakartaError] = useJakartaFonts({
    [typography.secondary.regular]: PlusJakartaSans_400Regular,
    [typography.secondary.medium]: PlusJakartaSans_500Medium,
    [typography.secondary.bold]: PlusJakartaSans_700Bold,
    [typography.secondary.extraBold]: PlusJakartaSans_800ExtraBold,
  });

  const loaded = outfitLoaded && jakartaLoaded;
  const error = outfitError || jakartaError;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return { loaded, error };
}
