import axios from 'axios';
import type { PublicHotel, SupplierHotel } from '../types';
import { redis, sortedKey } from '../redis';
// import { redis, sortedKey } from '../redis.js';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export async function fetchSupplierA(city: string): Promise<SupplierHotel[]> {
  const { data } = await axios.get<SupplierHotel[]>(`${API_BASE_URL}/supplierA/hotels`, { params: { city } });
  return data.map((h) => ({ ...h, supplier: 'Supplier A' }));
}

export async function fetchSupplierB(city: string): Promise<SupplierHotel[]> {
  const { data } = await axios.get<SupplierHotel[]>(`${API_BASE_URL}/supplierB/hotels`, { params: { city } });
  return data.map((h) => ({ ...h, supplier: 'Supplier B' }));
}

export async function dedupeAndPickBest(supA: SupplierHotel[], supB: SupplierHotel[]): Promise<PublicHotel[]> {
  const map = new Map<string, PublicHotel>();

  supA.concat(supB).forEach((h) => {
    const existing = map.get(h.name);
    const cand: PublicHotel = { name: h.name, price: h.price, supplier: h.supplier, commissionPct: h.commissionPct };
    if (!existing || cand.price < existing.price) map.set(h.name, cand);
  });

  return Array.from(map.values()).sort((x, y) => x.price - y.price);
}

export async function saveToRedis(city: string, hotels: PublicHotel[]): Promise<void> {
  const key = sortedKey(city);
  const pipeline = redis.pipeline();
  pipeline.del(key);
  hotels.forEach(h => {
    pipeline.zadd(key, h.price, JSON.stringify(h));
  });

  const ttl = parseInt(process.env.REDIS_TTL_SECONDS || '300', 10);
  if (ttl > 0) pipeline.expire(key, ttl);

  await pipeline.exec();
}

export async function filterFromRedis(city: string, minPrice?: number, maxPrice?: number): Promise<PublicHotel[]> {
  const key = sortedKey(city);
  const min = Number.isFinite(minPrice) ? String(minPrice) : '-inf';
  const max = Number.isFinite(maxPrice) ? String(maxPrice) : '+inf';
  const members = await redis.zrangebyscore(key, min, max);
  return members.map(m => JSON.parse(m));
}
