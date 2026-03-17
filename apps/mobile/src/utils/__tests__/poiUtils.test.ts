import { getCategoryIcon, getCategoryColor } from '../poiUtils';

describe('poiUtils', () => {
  describe('getCategoryIcon', () => {
    it('should return correct icon for known categories', () => {
      expect(getCategoryIcon('restaurant')).toBe('food-fork-drink');
      expect(getCategoryIcon('wc')).toBe('toilet');
      expect(getCategoryIcon('medical')).toBe('medical-bag');
    });

    it('should return default icon for unknown categories', () => {
      expect(getCategoryIcon('unknown')).toBe('map-pin');
    });

    it('should return default icon when category is undefined', () => {
      expect(getCategoryIcon(undefined)).toBe('map-pin');
    });
  });

  describe('getCategoryColor', () => {
    it('should return correct color for specific categories', () => {
      expect(getCategoryColor('toilet')).toBe('#9BD9D9');
      expect(getCategoryColor('medical')).toBe('#D99B9B');
    });

    it('should return default color for unknown categories', () => {
      expect(getCategoryColor('unknown')).toBe('#8E8E93');
    });
  });
});
