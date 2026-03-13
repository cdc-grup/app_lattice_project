import { UIPOI } from '../types/models/poi';

export const MOCK_POIS: any[] = [
  {
    id: '1',
    name: 'Paddock Club Grill',
    type: 'Food Court',
    status: 'open',
    crowdLevel: 'moderate',
    isWheelchairAccessible: true,
    hasPriorityLane: true,
    distance: '350m',
    time: '5 min',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: '2',
    name: 'Main Grandstand',
    type: 'Grandstand',
    status: 'open',
    crowdLevel: 'low',
    isWheelchairAccessible: true,
    hasPriorityLane: false,
    distance: '800m',
    time: '12 min',
    images: [
      'https://images.unsplash.com/photo-1511406361295-0a5ff814c0ad?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: '3',
    name: 'Official Merch Store',
    type: 'Shopping',
    status: 'closed',
    crowdLevel: 'high',
    isWheelchairAccessible: true,
    hasPriorityLane: false,
    distance: '200m',
    time: '3 min',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=400&q=80',
    ],
  },
];

export const MAP_FILTERS = [
  { id: '1', label: 'Grandstands', icon: 'map', category: 'grandstand' },
  { id: '2', label: 'Food', icon: 'coffee', category: 'restaurant' },
  { id: '3', label: 'Parking', icon: 'map-pin', category: 'parking' },
  { id: '4', label: 'Shopping', icon: 'shopping-bag', category: 'shop' },
  { id: '5', label: 'Toilets', icon: 'user', category: 'wc' },
];
