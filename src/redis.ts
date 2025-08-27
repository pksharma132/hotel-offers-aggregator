import Redis from 'ioredis';
import { logger } from './logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL);

redis.on('connect', () => logger.info({ REDIS_URL }, 'Connected to Redis'));
redis.on('error', (err) => logger.error({ err }, 'Redis error'));

export function sortedKey(city: string) {
  return `hotels:${city.toLowerCase()}:sorted`;
}
