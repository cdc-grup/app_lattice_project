export interface CategoryMetadata {
  icon: string;
  color: string;
  label: string;
}

export const NEUTRAL_MARKER_COLOR = 'rgba(255, 255, 255, 0.15)'; // Neutral glass-like color
export const NEUTRAL_MARKER_BORDER = 'rgba(255, 255, 255, 0.3)';

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  restaurant: { icon: 'food-fork-drink', color: '#FFD085', label: 'Food & Drinks' }, // Pastel Amber
  food: { icon: 'food-fork-drink', color: '#FFD085', label: 'Food & Drinks' },
  parking: { icon: 'parking', color: '#B4C5CD', label: 'Parking Area' }, // Pastel Slate
  shop: { icon: 'shopping', color: '#C197D6', label: 'Official Store' }, // Pastel Purple
  shopping: { icon: 'shopping', color: '#C197D6', label: 'Official Store' },
  wc: { icon: 'toilet', color: '#A2C2E1', label: 'Restrooms' }, // Pastel Blue
  toilet: { icon: 'toilet', color: '#A2C2E1', label: 'Restrooms' },
  restroom: { icon: 'toilet', color: '#A2C2E1', label: 'Restrooms' },
  grandstand: { icon: 'stadium-variant', color: '#A8D5BA', label: 'Grandstand' }, // Pastel Green
  medical: { icon: 'medical-bag', color: '#B39DDB', label: 'Medical Point' }, // Pastel Grape
  hospital: { icon: 'hospital-building', color: '#B39DDB', label: 'Hospital' },
  gate: { icon: 'door-open', color: '#9FA8DA', label: 'Entrance Gate' }, // Pastel Indigo
  entrance: { icon: 'door-open', color: '#9FA8DA', label: 'Entrance Gate' },
  meetup_point: { icon: 'account-group', color: '#C5E1A5', label: 'Meetup Point' }, // Pastel Lime
  info: { icon: 'information', color: '#80CBC4', label: 'Information' }, // Pastel Teal
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
