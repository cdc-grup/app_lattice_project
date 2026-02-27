import { useWindowDimensions } from 'react-native';

export const useCameraTilt = () => {
  const { width, height } = useWindowDimensions();
  
  // AR is active when in landscape
  const isLandscape = width > height;
  const isVisible = isLandscape;

  return { isVisible, isLandscape };
};
