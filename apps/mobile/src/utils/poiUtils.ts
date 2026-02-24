import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const getCategoryIcon = (category?: string): IconName => {
  switch (category?.toLowerCase()) {
    case 'restaurant': return 'food';
    case 'parking': return 'parking';
    case 'shop': return 'shopping';
    case 'wc': return 'toilet';
    case 'grandstand': return 'stadium-variant';
    default: return 'map-marker';
  }
};

export const getCategoryLabel = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'restaurant': return 'Food & Drinks';
    case 'parking': return 'Parking Area';
    case 'shop': return 'Official Store';
    case 'wc': return 'Restrooms';
    case 'grandstand': return 'Grandstand';
    default: return 'Point of Interest';
  }
};
