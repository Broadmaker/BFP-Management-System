import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

// ─── Establishments ───

app.get('/establishments', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.establishments).all();
  return c.json(items);
});

app.get('/establishments/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.establishments).where(eq(s.establishments.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Establishment not found' }, 404);
  const inspections = await db.select().from(s.inspections).where(eq(s.inspections.establishmentId, item.id)).all();
  const certs = await db.select().from(s.certificates).where(eq(s.certificates.establishmentId, item.id)).all();
  const violations = await db.select().from(s.violations).where(eq(s.violations.establishmentId, item.id)).all();
  return c.json({ ...item, inspections, certificates: certs, violations });
});

app.post('/establishments', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.establishments).values({ ...body, id: crypto.randomUUID(), createdAt: now, updatedAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/establishments/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: Record<string, any> = {};
  for (const key of ['businessName', 'ownerName', 'ownerContact', 'address', 'barangay', 'occupancyType', 'classification', 'complianceStatus']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  updates.updatedAt = new Date().toISOString();
  const [item] = await db.update(s.establishments).set(updates).where(eq(s.establishments.id, id)).returning();
  return c.json(item);
});

app.delete('/establishments/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.establishments).where(eq(s.establishments.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Inspections ───

app.get('/inspections', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.inspections).all();
  return c.json(items);
});

app.post('/inspections', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.inspections).values({ ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString() }).returning();
  return c.json(item, 201);
});

app.patch('/inspections/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.update(s.inspections).set(body).where(eq(s.inspections.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/inspections/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.inspections).where(eq(s.inspections.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Certificates (FSIC) ───

app.get('/certificates', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.certificates).all();
  return c.json(items);
});

app.post('/certificates', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.certificates).values({ ...body, id: crypto.randomUUID(), createdAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/certificates/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const updates: Record<string, any> = {};
  if (body.status) updates.status = body.status;
  if (body.expiryDate) updates.expiryDate = body.expiryDate;
  const [item] = await db.update(s.certificates).set(updates).where(eq(s.certificates.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/certificates/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.certificates).where(eq(s.certificates.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Violations ───

app.get('/violations', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.violations).all();
  return c.json(items);
});

app.post('/violations', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.violations).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.patch('/violations/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.update(s.violations).set(body).where(eq(s.violations.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/violations/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.violations).where(eq(s.violations.id, c.req.param('id')));
  return c.body(null, 204);
});

export default app;
