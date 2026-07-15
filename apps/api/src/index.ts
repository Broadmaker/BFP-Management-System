import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings } from './types.ts';
import incidentRoutes from './routes/incidents.ts';
import personnelRoutes from './routes/personnel.ts';
import assetRoutes from './routes/assets.ts';
import inspectionRoutes from './routes/inspections.ts';
import complianceRoutes from './routes/compliance.ts';
import hydrantRoutes from './routes/hydrants.ts';
import documentRoutes from './routes/documents.ts';
import reportRoutes from './routes/reports.ts';
import communityRoutes from './routes/community.ts';
import publicServiceRoutes from './routes/public-service.ts';
import userRoutes from './routes/users.ts';
import auditRoutes from './routes/audit.ts';

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.route('/api/incidents', incidentRoutes);
app.route('/api/personnel', personnelRoutes);
app.route('/api/assets', assetRoutes);
app.route('/api/inspections', inspectionRoutes);
app.route('/api/compliance', complianceRoutes);
app.route('/api/hydrants', hydrantRoutes);
app.route('/api/documents', documentRoutes);
app.route('/api/reports', reportRoutes);
app.route('/api/community', communityRoutes);
app.route('/api/services', publicServiceRoutes);
app.route('/api/users', userRoutes);
app.route('/api/audit', auditRoutes);

export default app;
