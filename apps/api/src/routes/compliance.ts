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

app.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const { limit, offset } = page(c);
  const items = await db.select().from(s.violations).limit(limit).offset(offset).all();
  c.header('Cache-Control', 'public, max-age=30');
  return c.json(items);
});

app.post('/', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.violations).values({ ...body, id: crypto.randomUUID(), noticeDate: new Date().toISOString() }).returning();
  return c.json(item, 201);
});

app.patch('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: Record<string, any> = {};
  if (body.status) updates.status = body.status;
  if (body.correctiveActions) updates.correctiveActions = body.correctiveActions;
  if (body.complianceDeadline) updates.complianceDeadline = body.complianceDeadline;
  if (body.status === 'Resolved') updates.resolvedAt = new Date().toISOString();
  const [item] = await db.update(s.violations).set(updates).where(eq(s.violations.id, id)).returning();
  return c.json(item);
});

app.delete('/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.violations).where(eq(s.violations.id, c.req.param('id')));
  return c.body(null, 204);
});

export default app;
