export type SupplierHotel = {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
  supplier: 'Supplier A' | 'Supplier B';
};

export type PublicHotel = {
  name: string;
  price: number;
  supplier: 'Supplier A' | 'Supplier B';
  commissionPct: number;
};

export type HealthReport = {
  ok: boolean;
  suppliers: Record<string, { ok: boolean; message?: string }>;
};
