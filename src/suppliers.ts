import { Request, Response } from 'express';
import { SupplierError } from './errors';

// Optional flags to simulate a supplier being down
const A_ENABLED = process.env.SUPPLIER_A_ENABLED !== 'false';
const B_ENABLED = process.env.SUPPLIER_B_ENABLED !== 'false';

// Hardcoded / random-ish fixtures with overlap on names
const baseA = [
  { hotelId: 'a1', name: 'Holtin', price: 6000, city: 'delhi', commissionPct: 10 },
  { hotelId: 'a2', name: 'Radison', price: 5900, city: 'delhi', commissionPct: 13 },
  { hotelId: 'a3', name: 'SkyStay', price: 4200, city: 'delhi', commissionPct: 15 },
  { hotelId: 'a4', name: 'RiverView', price: 5300, city: 'mumbai', commissionPct: 12 },
];

const baseB = [
  { hotelId: 'b1', name: 'Holtin', price: 5340, city: 'delhi', commissionPct: 20 },
  { hotelId: 'b2', name: 'Radison', price: 6200, city: 'delhi', commissionPct: 10 },
  { hotelId: 'b3', name: 'SunNest', price: 4800, city: 'delhi', commissionPct: 18 },
  { hotelId: 'b4', name: 'SeaView', price: 7000, city: 'mumbai', commissionPct: 16 },
];

function maybeDown(enabled: boolean) {
  if (!enabled) {
    throw new SupplierError('Supplier unavailable', 503);
  }
}

export const supplierAHandler = (req: Request, res: Response) => {
  try {
    maybeDown(A_ENABLED);
    const { city } = req.query as { city?: string };
    const list = baseA.filter((h) => !city || h.city.toLowerCase() === String(city).toLowerCase());
    res.json(list);
  } catch (e: any) {
    res.status(e.statusCode || 500).json({ error: e.message || 'Supplier A error' });
  }
};

export const supplierBHandler = (req: Request, res: Response) => {
  try {
    maybeDown(B_ENABLED);
    const { city } = req.query as { city?: string };
    const list = baseB.filter((h) => !city || h.city.toLowerCase() === String(city).toLowerCase());
    res.json(list);
  } catch (e: any) {
    res.status(e.statusCode || 500).json({ error: e.message || 'Supplier B error' });
  }
};
