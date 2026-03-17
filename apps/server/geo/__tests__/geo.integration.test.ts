import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import * as dbLib from '@app/db';

// Mock the entire DB library
vi.mock('@app/db', async () => {
  const actual = (await vi.importActual('@app/db')) as any;
  return {
    ...actual,
    db: {
      select: vi.fn(),
    },
  };
});

describe('Geo Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('geo_service_ok');
    });
  });

  describe('GET /pois/categories', () => {
    it('should return a list of categories', async () => {
      const response = await request(app).get('/pois/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('category');
    });
  });

  describe('GET /pois', () => {
    it('should return a FeatureCollection of POIs', async () => {
      // Mock the dynamic query
      const mockResults = [
        {
          id: 1,
          name: 'Main Gate',
          type: 'gate',
          description: 'Primary entrance',
          crowdLevel: 'low',
          isWheelchairAccessible: true,
          hasPriorityLane: false,
          geometry: JSON.stringify({ type: 'Point', coordinates: [2.1, 41.3] }),
        },
      ];

      const mockDynamic = vi.fn().mockResolvedValue(mockResults);
      const mockFrom = vi.fn().mockReturnValue({
        $dynamic: vi.fn().mockReturnValue({ where: mockDynamic, ...mockDynamic }),
      });

      // Drizzle dynamic query mock is complex, let's simplify for the test
      (dbLib.db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          $dynamic: vi.fn().mockReturnValue(Promise.resolve(mockResults)),
        }),
      });

      const response = await request(app).get('/pois');
      expect(response.status).toBe(200);
      expect(response.body.type).toBe('FeatureCollection');
      expect(response.body.features.length).toBe(1);
      expect(response.body.features[0].properties.name).toBe('Main Gate');
    });
  });
});
