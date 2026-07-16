import { Hono } from 'hono';
import { createDb } from '../db/index.ts';
import * as s from '../db/schema.ts';
import { eq, sql } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

// ─── Personnel CRUD ───

app.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const rows = await db.select().from(s.personnel)
    .leftJoin(s.users, eq(s.personnel.userId, s.users.id))
    .all();
  const items = rows.map(({ personnel, users }) => ({
    id: personnel.id,
    userId: personnel.userId,
    employeeNumber: personnel.employeeNumber,
    rank: personnel.rank,
    position: personnel.position,
    assignment: personnel.assignment,
    contactNumber: personnel.contactNumber,
    dateHired: personnel.dateHired,
    isActive: personnel.isActive,
    name: users?.name ?? null,
  }));
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
  const id = crypto.randomUUID();
  let userId: string | null = null;

  if (body.name) {
    userId = crypto.randomUUID();
    const now = new Date().toISOString();
    const employeeNumber = body.employeeNumber || `BFP-${String(Date.now()).slice(-4)}`;
    await db.insert(s.users).values({
      id: userId,
      email: body.email || `personnel-${employeeNumber}@bfp.local`,
      name: body.name,
      passwordHash: 'changeme123',
      role: body.role || 'Fire Officer',
      rank: body.rank || null,
      position: body.position || null,
      contactNumber: body.contactNumber || null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }).run();
  }

  const [item] = await db.insert(s.personnel).values({
    id,
    userId,
    employeeNumber: body.employeeNumber || `BFP-${String(Date.now()).slice(-4)}`,
    rank: body.rank || null,
    position: body.position,
    assignment: body.assignment || null,
    contactNumber: body.contactNumber || null,
    dateHired: body.dateHired || null,
    isActive: body.isActive ?? true,
  }).returning();

  return c.json({ ...item, name: body.name || null }, 201);
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

  // also update linked user name if provided
  if (body.name && item.userId) {
    await db.update(s.users).set({ name: body.name, updatedAt: new Date().toISOString() }).where(eq(s.users.id, item.userId)).run();
    return c.json({ ...item, name: body.name });
  }

  // re-fetch name from users table when name wasn't in the request
  const user = item.userId ? await db.select({ name: s.users.name }).from(s.users).where(eq(s.users.id, item.userId)).get() : null;
  return c.json({ ...item, name: user?.name ?? null });
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

app.delete('/attendance/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.attendance).where(eq(s.attendance.id, c.req.param('id')));
  return c.body(null, 204);
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

app.delete('/leave/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.leaveRequests).where(eq(s.leaveRequests.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Training ───

app.post('/training', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const [item] = await db.insert(s.trainings).values({ ...body, id: crypto.randomUUID() }).returning();
  return c.json(item, 201);
});

app.patch('/training/:id', async (c) => {
  const db = createDb(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  const [item] = await db.update(s.trainings).set(body).where(eq(s.trainings.id, id)).returning();
  return c.json(item);
});

app.delete('/training/:id', async (c) => {
  const db = createDb(c.env.DB);
  await db.delete(s.trainings).where(eq(s.trainings.id, c.req.param('id')));
  return c.body(null, 204);
});

// ─── Bulk sub-resource lookups ───

app.get('/shifts', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.shiftSchedules).all();
  return c.json(items);
});

app.get('/attendance', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.attendance).all();
  return c.json(items);
});

app.get('/leave', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.leaveRequests).all();
  return c.json(items);
});

app.get('/training', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(s.trainings).all();
  return c.json(items);
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
