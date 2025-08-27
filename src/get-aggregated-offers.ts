import { filterFromRedis } from './activities/aggregate-activities';
import { logger } from './logger';
import { redis, sortedKey } from './redis';
import { runWorkflow } from './temporal-helpers';
import { querySchema } from './validation-schema';
import type { Request, Response } from 'express';
import z from 'zod';

const TASK_QUEUE = process.env.TEMPORAL_TASK_QUEUE || 'hotel-offer-queue';

export async function getAggregateOffers(req: Request, res: Response) {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: z.treeifyError(parsed.error) });
  }
  try {
    const { city, minPrice, maxPrice } = parsed.data;

    const cached = (await redis.zcard(sortedKey(city))) > 0;

    if (!cached) {
      await runWorkflow(TASK_QUEUE, parsed.data);
    }

    const filtered = await filterFromRedis(city, minPrice, maxPrice);

    return res.json(filtered);
  } catch (err) {
    logger.error({ err }, 'Failed to process /api/hotels');
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
