import { describe, it, expect } from 'vitest';
import { getCategoryIcon } from '../poiUtils';

describe('poiUtils', () => {
  describe('getCategoryIcon', () => {
    it('should return correct icon for known categories', () => {
      expect(getCategoryIcon('restaurant')).toBe('food');
      expect(getCategoryIcon('wc')).toBe('toilet');
    });

    it('should return default icon for unknown categories', () => {
      expect(getCategoryIcon('unknown')).toBe('map-marker');
    });

    it('should return default icon when category is undefined', () => {
      expect(getCategoryIcon(undefined)).toBe('map-marker');
    });
  });
});
