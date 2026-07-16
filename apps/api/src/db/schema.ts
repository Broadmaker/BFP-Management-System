import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ─── Users ───
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('Fire Officer'),
  rank: text('rank'),
  position: text('position'),
  contactNumber: text('contact_number'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Incidents ───
export const incidents = sqliteTable('incidents', {
  id: text('id').primaryKey(),
  incidentNumber: text('incident_number').unique().notNull(),
  type: text('type').notNull(),
  severity: text('severity').notNull(),
  status: text('status').notNull().default('New'),
  location: text('location').notNull(),
  barangay: text('barangay').notNull(),
  occupancyType: text('occupancy_type'),
  description: text('description'),
  dateReported: text('date_reported').notNull(),
  reporterName: text('reporter_name'),
  reporterContact: text('reporter_contact'),
  reportedById: text('reported_by_id').references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Incident Timeline Events ───
export const incidentTimeline = sqliteTable('incident_timeline', {
  id: text('id').primaryKey(),
  incidentId: text('incident_id').references(() => incidents.id).notNull(),
  event: text('event').notNull(),
  timestamp: text('timestamp').notNull(),
  createdBy: text('created_by').references(() => users.id),
});

// ─── Dispatch Assignments ───
export const dispatchUnits = sqliteTable('dispatch_units', {
  id: text('id').primaryKey(),
  incidentId: text('incident_id').references(() => incidents.id).notNull(),
  unitName: text('unit_name').notNull(),
  unitType: text('unit_type').notNull(),
  personnelCount: integer('personnel_count').default(0),
  status: text('status').default('En Route'),
  dispatchedAt: text('dispatched_at'),
  arrivedAt: text('arrived_at'),
});

// ─── Incident Documentation ───
export const incidentDocuments = sqliteTable('incident_documents', {
  id: text('id').primaryKey(),
  incidentId: text('incident_id').references(() => incidents.id).notNull(),
  type: text('type').notNull(),
  url: text('url'),
  description: text('description'),
  uploadedAt: text('uploaded_at').notNull(),
  uploadedBy: text('uploaded_by').references(() => users.id),
});

// ─── Investigation ───
export const investigations = sqliteTable('investigations', {
  id: text('id').primaryKey(),
  incidentId: text('incident_id').references(() => incidents.id).unique().notNull(),
  investigatorId: text('investigator_id').references(() => users.id),
  causeClassification: text('cause_classification'),
  notes: text('notes'),
  recommendations: text('recommendations'),
  status: text('status').default('Open'),
  openedAt: text('opened_at'),
  closedAt: text('closed_at'),
});

// ─── Establishments ───
export const establishments = sqliteTable('establishments', {
  id: text('id').primaryKey(),
  businessName: text('business_name').notNull(),
  ownerName: text('owner_name').notNull(),
  ownerContact: text('owner_contact'),
  address: text('address').notNull(),
  barangay: text('barangay').notNull(),
  occupancyType: text('occupancy_type').notNull(),
  classification: text('classification'),
  complianceStatus: text('compliance_status').notNull().default('Pending'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Inspections ───
export const inspections = sqliteTable('inspections', {
  id: text('id').primaryKey(),
  establishmentId: text('establishment_id').references(() => establishments.id).notNull(),
  inspectorId: text('inspector_id').references(() => users.id),
  scheduledDate: text('scheduled_date'),
  completedDate: text('completed_date'),
  result: text('result'),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
});

// ─── Certificates (FSIC) ───
export const certificates = sqliteTable('certificates', {
  id: text('id').primaryKey(),
  establishmentId: text('establishment_id').references(() => establishments.id).notNull(),
  certificateNumber: text('certificate_number').unique().notNull(),
  issuedDate: text('issued_date').notNull(),
  expiryDate: text('expiry_date').notNull(),
  status: text('status').default('Active'),
  qrCode: text('qr_code'),
  issuedById: text('issued_by_id').references(() => users.id),
  createdAt: text('created_at').notNull(),
});

// ─── Violations ───
export const violations = sqliteTable('violations', {
  id: text('id').primaryKey(),
  establishmentId: text('establishment_id').references(() => establishments.id).notNull(),
  description: text('description').notNull(),
  noticeDate: text('notice_date').notNull(),
  complianceDeadline: text('compliance_deadline'),
  status: text('status').default('Open'),
  correctiveActions: text('corrective_actions'),
  resolvedAt: text('resolved_at'),
});

// ─── Personnel / Employees ───
export const personnel = sqliteTable('personnel', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  employeeNumber: text('employee_number').unique().notNull(),
  rank: text('rank'),
  position: text('position').notNull(),
  assignment: text('assignment'),
  contactNumber: text('contact_number'),
  dateHired: text('date_hired'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

// ─── Shift Schedules ───
export const shiftSchedules = sqliteTable('shift_schedules', {
  id: text('id').primaryKey(),
  personnelId: text('personnel_id').references(() => personnel.id).notNull(),
  shiftDate: text('shift_date').notNull(),
  shiftType: text('shift_type').notNull(),
  startTime: text('start_time'),
  endTime: text('end_time'),
  notes: text('notes'),
});

// ─── Attendance ───
export const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey(),
  personnelId: text('personnel_id').references(() => personnel.id).notNull(),
  date: text('date').notNull(),
  type: text('type').notNull(),
  timeIn: text('time_in'),
  timeOut: text('time_out'),
  remarks: text('remarks'),
});

// ─── Leave ───
export const leaveRequests = sqliteTable('leave_requests', {
  id: text('id').primaryKey(),
  personnelId: text('personnel_id').references(() => personnel.id).notNull(),
  type: text('type').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  reason: text('reason'),
  status: text('status').notNull().default('Pending'),
  approvedById: text('approved_by_id').references(() => users.id),
  createdAt: text('created_at').notNull(),
});

// ─── Training ───
export const trainings = sqliteTable('trainings', {
  id: text('id').primaryKey(),
  personnelId: text('personnel_id').references(() => personnel.id).notNull(),
  title: text('title').notNull(),
  provider: text('provider'),
  completedDate: text('completed_date'),
  expiryDate: text('expiry_date'),
  certificateUrl: text('certificate_url'),
});

// ─── Equipment ───
export const equipment = sqliteTable('equipment', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  serialNumber: text('serial_number').unique(),
  status: text('status').notNull().default('Operational'),
  location: text('location'),
  assignedTo: text('assigned_to').references(() => personnel.id),
  purchaseDate: text('purchase_date'),
  lastMaintenanceDate: text('last_maintenance_date'),
  nextMaintenanceDate: text('next_maintenance_date'),
  createdAt: text('created_at').notNull(),
});

// ─── Vehicles ───
export const vehicles = sqliteTable('vehicles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plateNumber: text('plate_number').unique().notNull(),
  type: text('type').notNull(),
  status: text('status').notNull().default('Available'),
  assignedCrew: text('assigned_crew'),
  mileage: integer('mileage').default(0),
  lastMaintenanceDate: text('last_maintenance_date'),
  nextMaintenanceDate: text('next_maintenance_date'),
});

// ─── Maintenance ───
export const maintenanceRecords = sqliteTable('maintenance_records', {
  id: text('id').primaryKey(),
  assetType: text('asset_type').notNull(),
  assetId: text('asset_id').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  performedDate: text('performed_date').notNull(),
  performedById: text('performed_by_id').references(() => users.id),
  cost: integer('cost'),
  nextScheduledDate: text('next_scheduled_date'),
});

// ─── Fuel Logs ───
export const fuelLogs = sqliteTable('fuel_logs', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id').references(() => vehicles.id).notNull(),
  date: text('date').notNull(),
  liters: integer('liters').notNull(),
  cost: integer('cost'),
  mileage: integer('mileage'),
  remarks: text('remarks'),
});

// ─── Hydrants ───
export const hydrants = sqliteTable('hydrants', {
  id: text('id').primaryKey(),
  hydrantId: text('hydrant_id').unique().notNull(),
  gpsLatitude: text('gps_latitude'),
  gpsLongitude: text('gps_longitude'),
  barangay: text('barangay').notNull(),
  street: text('street'),
  installationDate: text('installation_date'),
  status: text('status').notNull().default('Operational'),
  ownership: text('ownership'),
  waterPressure: integer('water_pressure'),
  lastInspectedDate: text('last_inspected_date'),
  createdAt: text('created_at').notNull(),
});

// ─── Hydrant Inspections ───
export const hydrantInspections = sqliteTable('hydrant_inspections', {
  id: text('id').primaryKey(),
  hydrantId: text('hydrant_id').references(() => hydrants.id).notNull(),
  inspectedById: text('inspected_by_id').references(() => users.id),
  inspectedDate: text('inspected_date').notNull(),
  waterPressure: integer('water_pressure'),
  isOperational: integer('is_operational', { mode: 'boolean' }).default(true),
  remarks: text('remarks'),
});

// ─── Community Programs ───
export const communityPrograms = sqliteTable('community_programs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  location: text('location'),
  barangay: text('barangay'),
  scheduledDate: text('scheduled_date'),
  status: text('status').notNull().default('Scheduled'),
  conductedById: text('conducted_by_id').references(() => users.id),
  createdAt: text('created_at').notNull(),
});

// ─── Program Participants ───
export const programParticipants = sqliteTable('program_participants', {
  id: text('id').primaryKey(),
  programId: text('program_id').references(() => communityPrograms.id).notNull(),
  name: text('name').notNull(),
  contactNumber: text('contact_number'),
  email: text('email'),
  barangay: text('barangay'),
  attended: integer('attended', { mode: 'boolean' }).default(false),
  registeredAt: text('registered_at').notNull(),
});

// ─── Volunteers ───
export const volunteers = sqliteTable('volunteers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  contactNumber: text('contact_number'),
  email: text('email'),
  barangay: text('barangay'),
  skills: text('skills'),
  trainingCompleted: integer('training_completed', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  registeredAt: text('registered_at').notNull(),
});

// ─── Documents ───
export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(),
  category: text('category'),
  description: text('description'),
  fileUrl: text('file_url'),
  status: text('status').notNull().default('Draft'),
  createdById: text('created_by_id').references(() => users.id),
  approvedById: text('approved_by_id').references(() => users.id),
  version: integer('version').default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Document Routing ───
export const documentRoutes = sqliteTable('document_routes', {
  id: text('id').primaryKey(),
  documentId: text('document_id').references(() => documents.id).notNull(),
  fromUserId: text('from_user_id').references(() => users.id),
  toUserId: text('to_user_id').references(() => users.id),
  action: text('action'),
  remarks: text('remarks'),
  routedAt: text('routed_at').notNull(),
});

// ─── Notifications ───
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message'),
  type: text('type').default('info'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  module: text('module'),
  referenceId: text('reference_id'),
  createdAt: text('created_at').notNull(),
});

// ─── Service Requests (Public Service) ───
export const serviceRequests = sqliteTable('service_requests', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  requester: text('requester').notNull(),
  business: text('business'),
  contact: text('contact'),
  date: text('date').notNull(),
  status: text('status').notNull().default('Pending'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Appointments ───
export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  business: text('business'),
  type: text('type').notNull(),
  date: text('date').notNull(),
  time: text('time'),
  address: text('address'),
  status: text('status').notNull().default('Pending'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Hazard Reports ───
export const hazardReports = sqliteTable('hazard_reports', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  location: text('location').notNull(),
  barangay: text('barangay'),
  reporter: text('reporter'),
  date: text('date').notNull(),
  status: text('status').notNull().default('New'),
  priority: text('priority').notNull().default('Medium'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Audit Logs ───
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  module: text('module').notNull(),
  referenceId: text('reference_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull(),
});
