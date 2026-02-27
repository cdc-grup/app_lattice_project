import React from 'react';
import { ViroARScene, ViroText, ViroTrackingStateConstants } from '@reactvision/react-viro';

export const MainARScene = () => {
  const [text, setText] = React.useState('Initializing AR...');

  function onInitialized(state: any, reason: any) {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText('Circuit Copilot AR Active');
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setText('AR Tracking Unavailable');
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={{
          fontFamily: 'Arial',
          fontSize: 30,
          color: '#ffffff',
          textAlignVertical: 'center',
          textAlign: 'center',
        }}
      />
    </ViroARScene>
  );
};
