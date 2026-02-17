import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3000;
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

app.use(cors());
app.use(express.json());

// --- INTERNAL ROUTES ---
app.get('/status', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    env: process.env.NODE_ENV,
    proxy_target: process.env.NODE_ENV === 'development' ? EXTERNAL_API_URL : 'none'
  });
});

// Add more local routes here...
// app.use('/auth', authRouter);

// --- PROXY FALLBACK (Development only) ---
if (process.env.NODE_ENV === 'development' && EXTERNAL_API_URL) {
  console.log(`[Proxy] Active. Falling back to: ${EXTERNAL_API_URL}`);
  
  const proxyMiddleware: RequestHandler = createProxyMiddleware({
    target: EXTERNAL_API_URL,
    changeOrigin: true,
    logger: console,
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] Forwarding: ${req.method} ${req.url}`);
      },
      error: (err, req, res) => {
        console.error('[Proxy] Error:', err);
      }
    }
  });

  app.use('/', proxyMiddleware);
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
