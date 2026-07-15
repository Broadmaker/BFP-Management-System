import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

// ─── Service Requests ───

app.get('/requests', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.serviceRequests).all();
  return c.json(items);
});

app.get('/requests/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.serviceRequests).where(eq(s.serviceRequests.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Service request not found' }, 404);
  return c.json(item);
});

app.post('/requests', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.serviceRequests).values({ ...body, id: crypto.randomUUID(), date: now, createdAt: now, updatedAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/requests/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: Record<string, any> = { updatedAt: new Date().toISOString() };
  for (const key of ['type', 'requester', 'business', 'contact', 'status']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [item] = await db.update(s.serviceRequests).set(updates).where(eq(s.serviceRequests.id, id)).returning();
  return c.json(item);
});

app.delete('/requests/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.serviceRequests).where(eq(s.serviceRequests.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Appointments ───

app.get('/appointments', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.appointments).all();
  return c.json(items);
});

app.get('/appointments/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.appointments).where(eq(s.appointments.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Appointment not found' }, 404);
  return c.json(item);
});

app.post('/appointments', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.appointments).values({ ...body, id: crypto.randomUUID(), createdAt: now, updatedAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/appointments/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: Record<string, any> = { updatedAt: new Date().toISOString() };
  for (const key of ['name', 'business', 'type', 'date', 'time', 'address', 'status']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [item] = await db.update(s.appointments).set(updates).where(eq(s.appointments.id, id)).returning();
  return c.json(item);
});

app.delete('/appointments/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.appointments).where(eq(s.appointments.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Hazard Reports ───

app.get('/hazards', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.hazardReports).all();
  return c.json(items);
});

app.get('/hazards/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.hazardReports).where(eq(s.hazardReports.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Hazard report not found' }, 404);
  return c.json(item);
});

app.post('/hazards', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.hazardReports).values({ ...body, id: crypto.randomUUID(), date: now, createdAt: now, updatedAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/hazards/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: Record<string, any> = { updatedAt: new Date().toISOString() };
  for (const key of ['type', 'location', 'barangay', 'reporter', 'status', 'priority']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [item] = await db.update(s.hazardReports).set(updates).where(eq(s.hazardReports.id, id)).returning();
  return c.json(item);
});

app.delete('/hazards/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.hazardReports).where(eq(s.hazardReports.id, c.req.param('id')));
  return c.body(null, 204);
});

export default app;
