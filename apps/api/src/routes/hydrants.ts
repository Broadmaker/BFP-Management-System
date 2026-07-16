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

// ─── Hydrants ───

app.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.hydrants).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.hydrants).where(eq(s.hydrants.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Hydrant not found' }, 404);
  return c.json(item);
});

app.post('/', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.hydrants).values({ ...body, id: crypto.randomUUID(), createdAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.update(s.hydrants).set(body).where(eq(s.hydrants.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.hydrants).where(eq(s.hydrants.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Hydrant Inspections ───

app.get('/inspections', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.hydrantInspections).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.post('/inspections', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.hydrantInspections).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.patch('/inspections/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.update(s.hydrantInspections).set(body).where(eq(s.hydrantInspections.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/inspections/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.hydrantInspections).where(eq(s.hydrantInspections.id, c.req.param('id')));
  return c.body(null, 204);
});

export default app;
