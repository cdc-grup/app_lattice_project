export const getCategoryIcon = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'restaurant':
      return 'coffee';
    case 'parking':
      return 'map-pin';
    case 'shop':
      return 'shopping-bag';
    case 'wc':
      return 'user';
    case 'grandstand':
      return 'map';
    default:
      return 'map-pin';
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
