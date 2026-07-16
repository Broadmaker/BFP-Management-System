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

// ─── Programs ───

app.get('/programs', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.communityPrograms).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.get('/programs/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.communityPrograms).where(eq(s.communityPrograms.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'Program not found' }, 404);
  return c.json(item);
});

app.post('/programs', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.communityPrograms).values({ ...body, id: crypto.randomUUID(), createdAt: now }).returning();
  return c.json(item, 201);
});

app.patch('/programs/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const updates: Record<string, any> = {};
  for (const key of ['title', 'type', 'description', 'location', 'barangay', 'scheduledDate', 'status']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [item] = await db.update(s.communityPrograms).set(updates).where(eq(s.communityPrograms.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/programs/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.communityPrograms).where(eq(s.communityPrograms.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Participants ───

app.get('/participants', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.programParticipants).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.post('/participants', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.programParticipants).values({ ...body, id: crypto.randomUUID(), registeredAt: new Date().toISOString() }).returning();
  return c.json(item, 201);
});

app.patch('/participants/:id', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const updates: Record<string, any> = {};
  for (const key of ['name', 'contactNumber', 'email', 'barangay', 'programId', 'attended']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [item] = await db.update(s.programParticipants).set(updates).where(eq(s.programParticipants.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.patch('/participants/:id/attended', async (c) => {
  const db = createDb(c.env.DB);
  const { attended } = await c.req.json();
  const [item] = await db.update(s.programParticipants).set({ attended }).where(eq(s.programParticipants.id, c.req.param('id'))).returning();
  return c.json(item);
});

app.delete('/participants/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.programParticipants).where(eq(s.programParticipants.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Volunteers ───

app.get('/volunteers', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.volunteers).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.post('/volunteers', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.volunteers).values({ ...body, id: crypto.randomUUID(), registeredAt: new Date().toISOString() }).returning();
  return c.json(item, 201);
});

app.patch('/volunteers/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: Record<string, any> = {};
  for (const key of ['name', 'contactNumber', 'email', 'barangay', 'skills', 'isActive', 'trainingCompleted']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [item] = await db.update(s.volunteers).set(updates).where(eq(s.volunteers.id, id)).returning();
  return c.json(item);
});

app.delete('/volunteers/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.volunteers).where(eq(s.volunteers.id, c.req.param('id')));
  return c.body(null, 204);
});

export default app;
