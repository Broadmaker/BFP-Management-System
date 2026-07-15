import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

app.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select({
    id: s.users.id, email: s.users.email, name: s.users.name,
    role: s.users.role, rank: s.users.rank, position: s.users.position,
    contactNumber: s.users.contactNumber, isActive: s.users.isActive,
    createdAt: s.users.createdAt, updatedAt: s.users.updatedAt,
  }).from(s.users).all();
  return c.json(items);
});

app.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const item = await db.select().from(s.users).where(eq(s.users.id, c.req.param('id'))).get();
  if (!item) return c.json({ error: 'User not found' }, 404);
  const { passwordHash, ...safe } = item;
  return c.json(safe);
});

app.post('/', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.users).values({
    ...body,
    id: crypto.randomUUID(),
    passwordHash: body.password || 'changeme123',
    createdAt: now, updatedAt: now,
  }).returning();
  const { passwordHash, ...safe } = item;
  return c.json(safe, 201);
});

app.patch('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: Record<string, any> = { updatedAt: new Date().toISOString() };
  for (const key of ['email', 'name', 'role', 'rank', 'position', 'contactNumber', 'isActive']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [item] = await db.update(s.users).set(updates).where(eq(s.users.id, id)).returning();
  const { passwordHash, ...safe } = item;
  return c.json(safe);
});

app.delete('/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.users).where(eq(s.users.id, c.req.param('id')));
  return c.body(null, 204);
});

export default app;
