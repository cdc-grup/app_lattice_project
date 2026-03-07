export interface CategoryMetadata {
  icon: string;
  color: string;
  label: string;
}

export const NEUTRAL_MARKER_COLOR = 'rgba(255, 255, 255, 0.15)'; // Neutral glass-like color
export const NEUTRAL_MARKER_BORDER = 'rgba(255, 255, 255, 0.3)';

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  restaurant: { icon: 'food-fork-drink', color: '#D48806', label: 'Food & Drinks' }, // Deep Amber
  food: { icon: 'food-fork-drink', color: '#D48806', label: 'Food & Drinks' },
  parking: { icon: 'parking', color: '#2F3E46', label: 'Parking Area' }, // Dark Slate
  shop: { icon: 'shopping', color: '#7209B7', label: 'Official Store' }, // Deep Purple
  shopping: { icon: 'shopping', color: '#7209B7', label: 'Official Store' },
  wc: { icon: 'toilet', color: '#1D3557', label: 'Restrooms' }, // Midnight Blue
  toilet: { icon: 'toilet', color: '#1D3557', label: 'Restrooms' },
  restroom: { icon: 'toilet', color: '#1D3557', label: 'Restrooms' },
  grandstand: { icon: 'stadium-variant', color: '#1B4332', label: 'Grandstand' }, // Forest Green
  medical: { icon: 'medical-bag', color: '#480CA8', label: 'Medical Point' }, // Dark Grape
  hospital: { icon: 'hospital-building', color: '#480CA8', label: 'Hospital' },
  gate: { icon: 'door-open', color: '#2B2D42', label: 'Entrance Gate' }, // Space Cadet Blue
  entrance: { icon: 'door-open', color: '#2B2D42', label: 'Entrance Gate' },
  meetup_point: { icon: 'account-group', color: '#386641', label: 'Meetup Point' }, // Evergreen
  info: { icon: 'information', color: '#006466', label: 'Information' }, // Deep Teal
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
