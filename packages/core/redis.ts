import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Redis Service - Shared Singleton Client
 * 
 * IMPORTANT: For geospatial operations (GEOADD/GEOPOS), Redis uses the order:
 * [Longitude, Latitude] (following GeoJSON standards).
 */
class RedisService {
  private static instance: Redis;

  public static getInstance(): Redis {
    if (!RedisService.instance) {
      console.log(`[Redis] Initializing connection to ${REDIS_URL}...`);
      
      RedisService.instance = new Redis(REDIS_URL, {
        maxRetriesPerRequest: null,
        reconnectOnError: (err: Error) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      });

      RedisService.instance.on('error', (err: Error) => {
        console.error('[Redis] ❌ Connection error:', err.message);
      });

      RedisService.instance.on('connect', () => {
        console.log('[Redis] 🔌 Connecting...');
      });

      RedisService.instance.on('ready', () => {
        console.log('[Redis] ✅ Client ready');
      });
    }
    return RedisService.instance;
  }
}

export const redis = RedisService.getInstance();
export default redis;
