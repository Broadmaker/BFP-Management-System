import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq, sql, desc } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

app.get('/overview', async (c) => {
  const db = createDb(c.env.DB);

  const tables = {
    incidents: s.incidents, inspections: s.inspections, personnel: s.personnel,
    equipment: s.equipment, hydrants: s.hydrants, violations: s.violations,
    certificates: s.certificates,
  };

  const results: Record<string, number> = {};
  for (const [key, table] of Object.entries(tables)) {
    const r = await db.select({ count: sql<number>`count(*)` }).from(table).get();
    results[key + 'Count'] = Number(r?.count ?? 0);
  }

  const openViolations = await db.select({ count: sql<number>`count(*)` }).from(s.violations).where(eq(s.violations.status, 'Open')).get();
  const activeCerts = await db.select({ count: sql<number>`count(*)` }).from(s.certificates).where(eq(s.certificates.status, 'Active')).get();
  results.openViolations = Number(openViolations?.count ?? 0);
  results.activeCertificates = Number(activeCerts?.count ?? 0);

  return c.json(results);
});

app.get('/incidents', async (c) => {
  const db = createDb(c.env.DB);
  const typeBreakdown = await db.select({ type: s.incidents.type, count: sql<number>`count(*)` }).from(s.incidents).groupBy(s.incidents.type).all();
  const severityBreakdown = await db.select({ severity: s.incidents.severity, count: sql<number>`count(*)` }).from(s.incidents).groupBy(s.incidents.severity).all();
  const statusBreakdown = await db.select({ status: s.incidents.status, count: sql<number>`count(*)` }).from(s.incidents).groupBy(s.incidents.status).all();
  return c.json({ typeBreakdown, severityBreakdown, statusBreakdown });
});

app.get('/inspections', async (c) => {
  const db = createDb(c.env.DB);
  const resultBreakdown = await db.select({ result: s.inspections.result, count: sql<number>`count(*)` }).from(s.inspections).groupBy(s.inspections.result).all();
  return c.json({ resultBreakdown });
});

app.get('/personnel', async (c) => {
  const db = createDb(c.env.DB);
  const total = await db.select({ count: sql<number>`count(*)` }).from(s.personnel).get();
  const active = await db.select({ count: sql<number>`count(*)` }).from(s.personnel).where(eq(s.personnel.isActive, true as any)).get();
  return c.json({ total: Number(total?.count ?? 0), active: Number(active?.count ?? 0) });
});

export default app;
