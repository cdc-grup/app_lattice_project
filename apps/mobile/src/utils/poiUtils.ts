export const getCategoryIcon = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'restaurant':
    case 'food':
      return 'coffee';
    case 'parking':
      return 'map-pin';
    case 'shop':
    case 'shopping':
      return 'shopping-bag';
    case 'wc':
    case 'toilet':
      return 'user';
    case 'grandstand':
      return 'map';
    case 'medical':
      return 'plus-square';
    case 'gate':
      return 'log-in';
    case 'meetup_point':
      return 'users';
    default:
      return 'map-pin';
  }
};

export const getCategoryColor = (category?: string): string => {
  return '#374151'; // Neutral Slate 700
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
