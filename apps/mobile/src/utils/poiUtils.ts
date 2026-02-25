export interface CategoryMetadata {
  icon: string;
  color: string;
  label: string;
}

const CATEGORY_MAP: Record<string, CategoryMetadata> = {
  restaurant: { icon: 'coffee', color: '#10B981', label: 'Food & Drinks' },
  food: { icon: 'coffee', color: '#10B981', label: 'Food & Drinks' },
  parking: { icon: 'map-pin', color: '#6B7280', label: 'Parking Area' },
  shop: { icon: 'shopping-bag', color: '#8B5CF6', label: 'Official Store' },
  shopping: { icon: 'shopping-bag', color: '#8B5CF6', label: 'Official Store' },
  wc: { icon: 'user', color: '#3B82F6', label: 'Restrooms' },
  toilet: { icon: 'user', color: '#3B82F6', label: 'Restrooms' },
  grandstand: { icon: 'map', color: '#EF4444', label: 'Grandstand' },
  medical: { icon: 'plus-square', color: '#F87171', label: 'Medical Point' },
  gate: { icon: 'log-in', color: '#F59E0B', label: 'Entrance Gate' },
  meetup_point: { icon: 'users', color: '#EC4899', label: 'Meetup Point' },
};

const DEFAULT_METADATA: CategoryMetadata = {
  icon: 'map-pin',
  color: '#374151',
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
