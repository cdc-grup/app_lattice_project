export interface CategoryMetadata {
  icon: string;
  color: string;
  label: string;
}

export const NEUTRAL_MARKER_COLOR = 'rgba(255, 255, 255, 0.15)'; // Neutral glass-like color
export const NEUTRAL_MARKER_BORDER = 'rgba(255, 255, 255, 0.3)';

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  restaurant: { icon: 'coffee', color: '#FF9500', label: 'Food & Drinks' }, // Apple Orange
  food: { icon: 'coffee', color: '#FF9500', label: 'Food & Drinks' },
  parking: { icon: 'map-pin', color: '#8E8E93', label: 'Parking Area' }, // Apple Gray
  shop: { icon: 'shopping-bag', color: '#FF2D55', label: 'Official Store' }, // Apple Pink
  shopping: { icon: 'shopping-bag', color: '#FF2D55', label: 'Official Store' },
  wc: { icon: 'user', color: '#007AFF', label: 'Restrooms' }, // Apple Blue
  toilet: { icon: 'user', color: '#007AFF', label: 'Restrooms' },
  grandstand: { icon: 'map', color: '#FF3B30', label: 'Grandstand' }, // Apple Red
  medical: { icon: 'plus-square', color: '#AF52DE', label: 'Medical Point' }, // Apple Purple
  gate: { icon: 'log-in', color: '#5856D6', label: 'Entrance Gate' }, // Apple Indigo
  meetup_point: { icon: 'users', color: '#5AC8FA', label: 'Meetup Point' }, // Apple Sky Blue
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
