import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_700Bold, 
  Inter_900Black, 
  useFonts 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { typography } from '../theme/typography';

export function useAppFonts() {
  const [loaded, error] = useFonts({
    [typography.primary.regular]: Inter_400Regular,
    [typography.primary.medium]: Inter_500Medium,
    [typography.primary.bold]: Inter_700Bold,
    [typography.primary.black]: Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return { loaded, error };
}
