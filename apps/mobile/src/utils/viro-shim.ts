import { NativeModules } from 'react-native';

/**
 * Shim to prevent crashes in @reactvision/react-viro when using Reanimated 3/4 
 * or the New Architecture where NativeModules.ReanimatedModule might be null or missing.
 */
try {
  if (NativeModules) {
    if (!NativeModules.ReanimatedModule) {
      // Create a dummy module if it doesn't exist
      try {
        (NativeModules as any).ReanimatedModule = {
          setJSAnimations: () => {},
        };
      } catch (innerError) {
        // Fallback for read-only NativeModules
        Object.defineProperty(NativeModules, 'ReanimatedModule', {
          value: { setJSAnimations: () => {} },
          writable: true,
          configurable: true,
        });
      }
    } else if (!NativeModules.ReanimatedModule.setJSAnimations) {
      // Add missing function to existing module
      try {
        NativeModules.ReanimatedModule.setJSAnimations = () => {};
      } catch (e) {
        console.warn('Viro Shim: Could not add setJSAnimations to existing module');
      }
    }
  }
} catch (error) {
  console.error('Viro-Reanimated Critical Shim Failure:', error);
}
