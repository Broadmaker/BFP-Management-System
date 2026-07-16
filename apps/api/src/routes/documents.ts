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

// ─── Documents ───

app.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.documents).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.documents).where(eq(s.documents.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Document not found' }, 404);
  const routes = await db.select().from(s.documentRoutes).where(eq(s.documentRoutes.documentId, item.id)).all();
  return c.json({ ...item, routes });
});

app.post('/', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.documents).values({ ...body, id: crypto.randomUUID(), version: 1, createdAt: now, updatedAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const [item] = await db.update(s.documents).set({ ...body, updatedAt: new Date().toISOString() }).where(eq(s.documents.id, id)).returning();
  return c.json(item);
});

app.delete('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  await db.delete(s.documentRoutes).where(eq(s.documentRoutes.documentId, id));
  await db.delete(s.documents).where(eq(s.documents.id, id));
  return c.body(null, 204);
});

// ─── Document Routing ───

app.get('/routes', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.documentRoutes).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.post('/routes', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.documentRoutes).values({ ...body, id: crypto.randomUUID(), routedAt: new Date().toISOString() }).returning();
  return c.json(item, 201);
});

export default app;
