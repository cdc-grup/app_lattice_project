import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from '@app/core';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs (Defaults for local dev)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const GEO_SERVICE_URL = process.env.GEO_SERVICE_URL || 'http://localhost:3002';
const SOCIAL_SERVICE_URL = process.env.SOCIAL_SERVICE_URL || 'http://localhost:3003';

app.use(cors());
app.use(logger);

// Health Check
app.get('/status', (req: Request, res: Response) => {
  res.json({ status: 'gateway_ok', timestamp: new Date(), env: process.env.NODE_ENV });
});

// --- ROUTING ---

// Auth Service
app.use(createProxyMiddleware({
  pathFilter: ['/auth', '/users'],
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
}));

// Geo Service
app.use(createProxyMiddleware({
  pathFilter: ['/pois', '/locations', '/navigation', '/map'],
  target: GEO_SERVICE_URL,
  changeOrigin: true,
}));

// Social Service
app.use(createProxyMiddleware({
  pathFilter: '/groups',
  target: SOCIAL_SERVICE_URL,
  changeOrigin: true,
}));

// Fallback for unhandled routes (404)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found at Gateway level' });
});

app.listen(PORT, () => {
  console.log(`[Gateway] running on port ${PORT}`);
  console.log(`[Gateway] Routing /auth, /users -> ${AUTH_SERVICE_URL}`);
  console.log(`[Gateway] Routing /pois, /locations, /navigation -> ${GEO_SERVICE_URL}`);
  console.log(`[Gateway] Routing /groups -> ${SOCIAL_SERVICE_URL}`);
});
