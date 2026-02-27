import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import { MainARScene } from './MainARScene';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface AROverlayProps {
  isVisible: boolean;
}

export const AROverlay: React.FC<AROverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <Animated.View 
      entering={FadeIn.duration(500)} 
      exiting={FadeOut.duration(500)}
      style={StyleSheet.absoluteFill}
    >
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: MainARScene,
        }}
        style={styles.container}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
