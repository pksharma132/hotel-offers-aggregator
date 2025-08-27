import { proxyActivities } from '@temporalio/workflow';
import * as activities from '../activities/aggregate-activities';
import type { PublicHotel } from '../types.js';
import { QueryParams } from '../validation-schema';

const { fetchSupplierA, fetchSupplierB, dedupeAndPickBest, saveToRedis } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
});

export async function aggregateHotelsWorkflow(params: QueryParams): Promise<PublicHotel[]> {
  const { city } = params;
  const [supA, supB] = await Promise.all([fetchSupplierA(city), fetchSupplierB(city)]);
  const best = await dedupeAndPickBest(supA, supB);
  await saveToRedis(city, best);
  return best;
}
