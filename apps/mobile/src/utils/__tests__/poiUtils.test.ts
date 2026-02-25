import { getCategoryIcon, getCategoryColor } from '../poiUtils';

describe('poiUtils', () => {
  describe('getCategoryIcon', () => {
    it('should return correct icon for known categories', () => {
      expect(getCategoryIcon('restaurant')).toBe('coffee');
      expect(getCategoryIcon('wc')).toBe('user');
      expect(getCategoryIcon('medical')).toBe('plus-square');
    });

    it('should return default icon for unknown categories', () => {
      expect(getCategoryIcon('unknown')).toBe('map-pin');
    });

    it('should return default icon when category is undefined', () => {
      expect(getCategoryIcon(undefined)).toBe('map-pin');
    });
  });

  describe('getCategoryColor', () => {
    it('should return neutral color for all categories', () => {
      expect(getCategoryColor('restaurant')).toBe('#374151');
      expect(getCategoryColor('medical')).toBe('#374151');
      expect(getCategoryColor('unknown')).toBe('#374151');
    });
  });
});
