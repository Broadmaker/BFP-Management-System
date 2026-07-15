import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

app.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const query: Record<string, any> = {};
  const module = c.req.query('module');
  const action = c.req.query('action');
  const userId = c.req.query('userId');
  const from = c.req.query('from');
  const to = c.req.query('to');
  const limit = Number(c.req.query('limit') || '200');

  const conditions = [];
  if (module) conditions.push(eq(s.auditLogs.module, module));
  if (action) conditions.push(eq(s.auditLogs.action, action));
  if (userId) conditions.push(eq(s.auditLogs.userId, userId));
  if (from) conditions.push(gte(s.auditLogs.createdAt, from));
  if (to) conditions.push(lte(s.auditLogs.createdAt, to));

  const items = await db.select().from(s.auditLogs)
    .where(conditions.length ? and(...conditions) : undefined as any)
    .orderBy(desc(s.auditLogs.createdAt))
    .limit(limit)
    .all();

  return c.json({ items, total: items.length });
});

app.get('/modules', async (c) => {
  const db = createDb(c.env.DB);
  const result = await db.select({ module: s.auditLogs.module })
    .from(s.auditLogs)
    .groupBy(s.auditLogs.module)
    .all();
  return c.json(result.map(r => r.module));
});

app.get('/actions', async (c) => {
  const db = createDb(c.env.DB);
  const result = await db.select({ action: s.auditLogs.action })
    .from(s.auditLogs)
    .groupBy(s.auditLogs.action)
    .all();
  return c.json(result.map(r => r.action));
});

export default app;
