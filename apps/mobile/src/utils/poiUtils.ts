export interface CategoryMetadata {
  icon: string;
  color: string;
  label: string;
}

export const NEUTRAL_MARKER_COLOR = 'rgba(255, 255, 255, 0.15)'; // Neutral glass-like color
export const NEUTRAL_MARKER_BORDER = 'rgba(255, 255, 255, 0.3)';

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  restaurant: { icon: 'food-fork-drink', color: '#FF9F0A', label: 'Food & Drinks' }, // Apple System Orange
  food: { icon: 'food-fork-drink', color: '#FF9F0A', label: 'Food & Drinks' },
  parking: { icon: 'parking', color: '#0A84FF', label: 'Parking Area' }, // Apple System Blue
  shop: { icon: 'shopping', color: '#BF5AF2', label: 'Official Store' }, // Apple System Purple
  shopping: { icon: 'shopping', color: '#BF5AF2', label: 'Official Store' },
  wc: { icon: 'toilet', color: '#64D2FF', label: 'Restrooms' }, // Apple System Cyan
  toilet: { icon: 'toilet', color: '#64D2FF', label: 'Restrooms' },
  restroom: { icon: 'toilet', color: '#64D2FF', label: 'Restrooms' },
  grandstand: { icon: 'stadium-variant', color: '#32D74B', label: 'Grandstand' }, // Apple System Green
  medical: { icon: 'medical-bag', color: '#FF453A', label: 'Medical Point' }, // Apple System Red
  hospital: { icon: 'hospital-building', color: '#FF453A', label: 'Hospital' },
  gate: { icon: 'door-open', color: '#5E5CE6', label: 'Entrance Gate' }, // Apple System Indigo
  entrance: { icon: 'door-open', color: '#5E5CE6', label: 'Entrance Gate' },
  meetup_point: { icon: 'account-group', color: '#66D4CF', label: 'Meetup Point' }, // Apple System Teal
  info: { icon: 'information', color: '#FFD60A', label: 'Information' }, // Apple System Yellow
};

export const DIRECT_ACCESS_CATEGORIES = ['gate', 'grandstand', 'parking'];

const DEFAULT_METADATA: CategoryMetadata = {
  icon: 'map-pin',
  color: '#8E8E93',
  label: 'Point of Interest',
};

export const getCategoryMetadata = (category?: string): CategoryMetadata => {
  if (!category) return DEFAULT_METADATA;
  return CATEGORY_MAP[category.toLowerCase()] || DEFAULT_METADATA;
};

// Legacy support and direct accessors
export const getCategoryIcon = (category?: string): string => getCategoryMetadata(category).icon;
export const getCategoryColor = (category?: string): string => getCategoryMetadata(category).color;
export const getCategoryLabel = (category?: string): string => getCategoryMetadata(category).label;

/**
 * Maps legacy or multi-framework icon names to Feather names.
 */
export const mapIconName = (name: string): string => {
  const map: Record<string, string> = {
    'SlidersHorizontal': 'sliders',
    'Search': 'search',
    'X': 'x',
    'Utensils': 'coffee',
    'SquareP': 'map-pin',
    'ShoppingBag': 'shopping-bag',
    'Accessibility': 'user',
    'Stadium': 'map',
    'MapPin': 'map-pin',
    'door-open': 'log-in',
    'stadium-variant': 'map',
    'medical-bag': 'plus-square',
    'account-group': 'users'
  };
  return map[name] || name.toLowerCase();
};
