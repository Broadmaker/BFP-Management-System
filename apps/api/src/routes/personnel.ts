import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

// ─── Personnel CRUD ───

app.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.personnel).all();
  return c.json(items);
});

app.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const person = await db.select().from(s.personnel).where(eq(s.personnel.id, id)).get();
  if (!person) return c.json({ error: 'Personnel not found' }, 404);
  const shifts = await db.select().from(s.shiftSchedules).where(eq(s.shiftSchedules.personnelId, id)).all();
  const attendance = await db.select().from(s.attendance).where(eq(s.attendance.personnelId, id)).all();
  const leaves = await db.select().from(s.leaveRequests).where(eq(s.leaveRequests.personnelId, id)).all();
  const trainings = await db.select().from(s.trainings).where(eq(s.trainings.personnelId, id)).all();
  return c.json({ ...person, shiftSchedules: shifts, attendance, leaveRequests: leaves, trainings });
});

app.post('/', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.personnel).values({
    ...body,
    id: crypto.randomUUID(),
    isActive: body.isActive ?? true,
    dateHired: body.dateHired || null,
  }).returning();
  return c.json(item, 201);
});

app.patch('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const updates: Record<string, any> = {};
  if (body.rank) updates.rank = body.rank;
  if (body.position) updates.position = body.position;
  if (body.assignment) updates.assignment = body.assignment;
  if (body.contactNumber) updates.contactNumber = body.contactNumber;
  if (body.isActive !== undefined) updates.isActive = body.isActive;
  const [item] = await db.update(s.personnel).set(updates).where(eq(s.personnel.id, id)).returning();
  return c.json(item);
});

app.delete('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  await db.delete(s.personnel).where(eq(s.personnel.id, id));
  return c.body(null, 204);
});

// ─── Shifts ───

app.post('/shifts', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.shiftSchedules).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.patch('/shifts/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const [item] = await db.update(s.shiftSchedules).set(body).where(eq(s.shiftSchedules.id, id)).returning();
  return c.json(item);
});

app.delete('/shifts/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  await db.delete(s.shiftSchedules).where(eq(s.shiftSchedules.id, id));
  return c.body(null, 204);
});

// ─── Attendance ───

app.post('/attendance', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.attendance).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.patch('/attendance/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const [item] = await db.update(s.attendance).set(body).where(eq(s.attendance.id, id)).returning();
  return c.json(item);
});

// ─── Leave ───

app.post('/leave', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.leaveRequests).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.patch('/leave/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const [item] = await db.update(s.leaveRequests).set(body).where(eq(s.leaveRequests.id, id)).returning();
  return c.json(item);
});

// ─── Training ───

app.post('/training', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.trainings).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

// ─── Sub-resource lookups ───

app.get('/:id/shifts', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.shiftSchedules).where(eq(s.shiftSchedules.personnelId, c.req.param('id'))).all();
  return c.json(items);
});

app.get('/:id/attendance', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.attendance).where(eq(s.attendance.personnelId, c.req.param('id'))).all();
  return c.json(items);
});

app.get('/:id/leave', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.leaveRequests).where(eq(s.leaveRequests.personnelId, c.req.param('id'))).all();
  return c.json(items);
});

app.get('/:id/training', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.trainings).where(eq(s.trainings.personnelId, c.req.param('id'))).all();
  return c.json(items);
});

export default app;
