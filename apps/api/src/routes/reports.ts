import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq, sql, desc } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

app.get('/overview', async (c) => {
  const db = createDb(c.env.DB);

  const [
    incidentsCount,
    inspectionsCount,
    personnelCount,
    equipmentCount,
    hydrantsCount,
    violationsCount,
    certificatesCount,
    openViolations,
    activeCerts,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(s.incidents).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.inspections).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.personnel).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.equipment).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.hydrants).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.violations).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.certificates).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.violations).where(eq(s.violations.status, 'Open')).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.certificates).where(eq(s.certificates.status, 'Active')).get(),
  ]);

  return c.json({
    incidentsCount: Number(incidentsCount?.count ?? 0),
    inspectionsCount: Number(inspectionsCount?.count ?? 0),
    personnelCount: Number(personnelCount?.count ?? 0),
    equipmentCount: Number(equipmentCount?.count ?? 0),
    hydrantsCount: Number(hydrantsCount?.count ?? 0),
    violationsCount: Number(violationsCount?.count ?? 0),
    certificatesCount: Number(certificatesCount?.count ?? 0),
    openViolations: Number(openViolations?.count ?? 0),
    activeCertificates: Number(activeCerts?.count ?? 0),
  });
});

app.get('/incidents', async (c) => {
  const db = createDb(c.env.DB);
  const [typeBreakdown, severityBreakdown, statusBreakdown] = await Promise.all([
    db.select({ type: s.incidents.type, count: sql<number>`count(*)` }).from(s.incidents).groupBy(s.incidents.type).all(),
    db.select({ severity: s.incidents.severity, count: sql<number>`count(*)` }).from(s.incidents).groupBy(s.incidents.severity).all(),
    db.select({ status: s.incidents.status, count: sql<number>`count(*)` }).from(s.incidents).groupBy(s.incidents.status).all(),
  ]);
  return c.json({ typeBreakdown, severityBreakdown, statusBreakdown });
});

app.get('/inspections', async (c) => {
  const db = createDb(c.env.DB);
  const resultBreakdown = await db.select({ result: s.inspections.result, count: sql<number>`count(*)` }).from(s.inspections).groupBy(s.inspections.result).all();
  return c.json({ resultBreakdown });
});

app.get('/personnel', async (c) => {
  const db = createDb(c.env.DB);
  const [total, active] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(s.personnel).get(),
    db.select({ count: sql<number>`count(*)` }).from(s.personnel).where(eq(s.personnel.isActive, true as any)).get(),
  ]);
  return c.json({ total: Number(total?.count ?? 0), active: Number(active?.count ?? 0) });
});

export default app;
