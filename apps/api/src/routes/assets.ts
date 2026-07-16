import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

function page(c: any) {
  const limit = Math.min(Number(c.req.query('limit')) || 50, 200);
  const offset = Number(c.req.query('offset')) || 0;
  return { limit, offset };
}

// ─── Equipment ───

app.get('/equipment', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.equipment).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.get('/equipment/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.equipment).where(eq(s.equipment.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Equipment not found' }, 404);
  return c.json(item);
});

app.post('/equipment', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.equipment).values({ ...body, id: crypto.randomUUID(), createdAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/equipment/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.update(s.equipment).set(body).where(eq(s.equipment.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/equipment/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.equipment).where(eq(s.equipment.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Vehicles ───

app.get('/vehicles', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.vehicles).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.get('/vehicles/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.vehicles).where(eq(s.vehicles.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Vehicle not found' }, 404);
  return c.json(item);
});

app.post('/vehicles', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.vehicles).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.patch('/vehicles/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.update(s.vehicles).set(body).where(eq(s.vehicles.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/vehicles/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.vehicles).where(eq(s.vehicles.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Maintenance ───

app.get('/maintenance', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.maintenanceRecords).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.post('/maintenance', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.maintenanceRecords).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.patch('/maintenance/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.update(s.maintenanceRecords).set(body).where(eq(s.maintenanceRecords.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/maintenance/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.maintenanceRecords).where(eq(s.maintenanceRecords.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Fuel Logs ───

app.get('/fuel', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.fuelLogs).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.post('/fuel', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.fuelLogs).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.delete('/fuel/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.fuelLogs).where(eq(s.fuelLogs.id, c.req.param('id')));
  return c.body(null, 204);
});

export default app;
