import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

app.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.incidents).orderBy(desc(s.incidents.dateReported)).all();
  return c.json(items);
});

app.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const incident = await db.select().from(s.incidents).where(eq(s.incidents.id, id)).get();
  if (!incident) return c.json({ error: 'Incident not found' }, 404);
  const timeline = await db.select().from(s.incidentTimeline).where(eq(s.incidentTimeline.incidentId, id)).all();
  const dispatch = await db.select().from(s.dispatchUnits).where(eq(s.dispatchUnits.incidentId, id)).all();
  const docs = await db.select().from(s.incidentDocuments).where(eq(s.incidentDocuments.incidentId, id)).all();
  const investigation = await db.select().from(s.investigations).where(eq(s.investigations.incidentId, id)).get();
  return c.json({ ...incident, incidentTimeline: timeline, dispatchUnits: dispatch, incidentDocuments: docs, investigations: investigation ? [investigation] : [] });
});

app.post('/', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const now = new Date().toISOString();
  const [item] = await db.insert(s.incidents).values({
    ...body,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    dateReported: body.dateReported || now,
  }).returning();
  return c.json(item, 201);
});

app.patch('/:id/status', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const { status } = await c.req.json();
  const [item] = await db.update(s.incidents)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(s.incidents.id, id))
    .returning();
  return c.json(item);
});

export default app;
