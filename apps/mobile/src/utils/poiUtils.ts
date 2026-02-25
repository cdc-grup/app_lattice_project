import { LucideIcon } from 'lucide-react-native';

export const getCategoryIcon = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'restaurant':
      return 'Utensils';
    case 'parking':
      return 'SquareP';
    case 'shop':
      return 'ShoppingBag';
    case 'wc':
      return 'Accessibility'; // Or 'User' - Lucide doesn't have a direct 'toilet' like MDI, 'Accessibility' or 'User' is common
    case 'grandstand':
      return 'Stadium';
    default:
      return 'MapPin';
  }
};

export const getCategoryLabel = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'restaurant':
      return 'Food & Drinks';
    case 'parking':
      return 'Parking Area';
    case 'shop':
      return 'Official Store';
    case 'wc':
      return 'Restrooms';
    case 'grandstand':
      return 'Grandstand';
    default:
      return 'Point of Interest';
  }
};
