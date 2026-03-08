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
const basePath = process.env.BASE_PATH || '/';
const router = express.Router();

// Service URLs (Defaults for local dev)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const GEO_SERVICE_URL = process.env.GEO_SERVICE_URL || 'http://localhost:3002';
const SOCIAL_SERVICE_URL = process.env.SOCIAL_SERVICE_URL || 'http://localhost:3003';

app.use(cors());
app.use(logger);

// Log incoming requests for debugging
app.use((req, _res, next) => {
  console.log(`[Gateway] Incoming: ${req.method} ${req.url}`);
  next();
});

// Health Check
router.get('/status', (req: Request, res: Response) => {
  res.json({ status: 'gateway_ok', timestamp: new Date(), env: process.env.NODE_ENV, basePath });
});

// --- API ROUTING ---
const API_PREFIX = '/api/v1';

// Helper to create proxy with robust path rewrite and logging
const createServiceProxy = (target: string, label: string, paths: string[]) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathFilter: (path: string) => {
      // Return true if the path starts with any of the allowed service paths, 
      // accounting for optional API_PREFIX
      return paths.some(p => path.startsWith(p) || path.startsWith(`${API_PREFIX}${p}`));
    },
    pathRewrite: (path: string) => {
      let newPath = path;
      // Strip API_PREFIX if present
      if (path.startsWith(API_PREFIX)) {
        newPath = path.substring(API_PREFIX.length);
      }
      
      console.log(`[Gateway -> ${label}] Proxying: ${path} -> ${newPath || '/'}`);
      return newPath || '/';
    },
    on: {
      error: (err: any, req: any, res: any) => {
        console.error(`[Gateway -> ${label}] Error:`, err.message);
        if (res && res.writeHead) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `${label} service unreachable`, details: err.message }));
        }
      },
      proxyRes: (proxyRes: any, req: any, res: any) => {
        if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
          console.warn(`[Gateway -> ${label}] Error Response: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`);
        } else {
          console.log(`[Gateway -> ${label}] Success: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`);
        }
      }
    }
  });
};

// Mount Service Proxies
// We mount them on the router root and let the internal pathFilter handle matches.
// This prevents Express from stripping the matched path part, giving us full control.

// Auth Service: /auth, /users
router.use(createServiceProxy(AUTH_SERVICE_URL, 'Auth', ['/auth', '/users']));

// Geo Service: /pois, /locations, /navigation, /map, /saved
router.use(createServiceProxy(GEO_SERVICE_URL, 'Geo', ['/pois', '/locations', '/navigation', '/map', '/saved']));

// Social Service: /groups, /telemetry
router.use(createServiceProxy(SOCIAL_SERVICE_URL, 'Social', ['/groups', '/telemetry']));

// Fallback for unhandled API routes
router.use('*', (req: Request, res: Response) => {
  console.log(`[Gateway] 404 Fallback reached for: ${req.method} ${req.originalUrl} (URL in router: ${req.url})`);
  res.status(404).json({ 
    error: 'Route not found at Gateway level',
    requestedUrl: req.originalUrl,
    routerPath: req.url,
    basePath
  });
});

if (basePath && basePath !== '/') {
  // Mount the router on the base path
  app.use(basePath, router);
  // Also provide a root fallback to catch things without a prefix directly and 404 immediately
  app.use('*', (req: Request, res: Response) => res.status(404).json({ error: 'Route not found at Global level. Missing /lattice prefix?' }));
  console.log(`[Gateway] Mounting API at base path: ${basePath}`);
} else {
  app.use('/', router);
}

app.listen(PORT, () => {
  console.log(`[Gateway] running on port ${PORT}`);
  console.log(`[Gateway] Base Path: ${basePath}`);
  console.log(`[Gateway] Routing /auth, /users -> ${AUTH_SERVICE_URL}`);
  console.log(`[Gateway] Routing /pois, /locations, /navigation -> ${GEO_SERVICE_URL}`);
  console.log(`[Gateway] Routing /groups -> ${SOCIAL_SERVICE_URL}`);
});
