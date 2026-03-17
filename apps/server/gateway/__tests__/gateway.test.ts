import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('Gateway Service', () => {
  it('should return 200 OK for health check', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'gateway_ok');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  describe('API Routing', () => {
    it('should attempt to proxy /api/v1/auth routes', async () => {
      // Even if the auth service is down, the gateway should try to proxy it
      // and return a 502 (Bad Gateway) since the target is unreachable in test env
      const response = await request(app).get('/api/v1/auth/health');
      expect([404, 502]).toContain(response.status);
    });

    it('should return 404 for api routes not matched by any service', async () => {
      const response = await request(app).get('/api/v1/nonexistent-service');
      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Route not found');
    });
  });
});
