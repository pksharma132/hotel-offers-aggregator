import express from 'express';
import { httpLogger, logger } from './logger';
import { supplierAHandler, supplierBHandler } from './suppliers';
import { getAggregateOffers } from './get-aggregated-offers';
import { HealthReport } from './types';

const app = express();
app.use(express.json());
app.use(httpLogger);

const PORT = parseInt(process.env.PORT || '3000', 10);

app.get('/supplierA/hotels', supplierAHandler);
app.get('/supplierB/hotels', supplierBHandler);

app.get('/health', async (req, res) => {
  const report: HealthReport = { ok: true, suppliers: {} };
  const base = `http://localhost:${PORT}`;
  const suppliers = [
    ['Supplier A', '/supplierA/hotels'],
    ['Supplier B', '/supplierB/hotels'],
  ];
  for (const [name, path] of suppliers) {
    try {
      const url = new URL(path, base);
      url.searchParams.set('city', 'delhi');
      const r = await fetch(url.toString());
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      report.suppliers[name] = { ok: true };
    } catch (e: any) {
      report.suppliers[name] = { ok: false, message: e.message };
      report.ok = false;
    }
  }
  res.json(report);
});

app.get('/api/hotels', getAggregateOffers);

app.listen(PORT, () => {
  logger.info({ PORT }, 'API server listening');
});
