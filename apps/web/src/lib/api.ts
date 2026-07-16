const BASE_URL = import.meta.env.VITE_API_URL || 'https://bfp-station-api.sanigkram24.workers.dev/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

function list<T>(path: string): Promise<T[]> { return request<T[]>(path); }
function get<T>(path: string): Promise<T> { return request<T>(path); }
function create<T>(path: string, body: any): Promise<T> { return request<T>(path, { method: 'POST', body: JSON.stringify(body) }); }
function update<T>(path: string, body: any): Promise<T> { return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }); }
function del(path: string): Promise<void> { return request<void>(path, { method: 'DELETE' }); }

type Dict = Record<string, any>;

// ─── Users ───
export const UsersApi = {
  list: () => list<Dict>('/users'),
  get: (id: string) => get<Dict>(`/users/${id}`),
  create: (data: Dict) => create<Dict>('/users', data),
  update: (id: string, data: Dict) => update<Dict>(`/users/${id}`, data),
  delete: (id: string) => del(`/users/${id}`),
};

// ─── Personnel ───
export const PersonnelApi = {
  list: () => list<Dict>('/personnel'),
  get: (id: string) => get<Dict>(`/personnel/${id}`),
  create: (data: Dict) => create<Dict>('/personnel', data),
  update: (id: string, data: Dict) => update<Dict>(`/personnel/${id}`, data),
  delete: (id: string) => del(`/personnel/${id}`),
};

// ─── Shifts ───
export const ShiftsApi = {
  list: () => list<Dict>('/personnel/shifts'),
  create: (data: Dict) => create<Dict>('/personnel/shifts', data),
  update: (id: string, data: Dict) => update<Dict>(`/personnel/shifts/${id}`, data),
  delete: (id: string) => del(`/personnel/shifts/${id}`),
};

// ─── Attendance ───
export const AttendanceApi = {
  list: () => list<Dict>('/personnel/attendance'),
  create: (data: Dict) => create<Dict>('/personnel/attendance', data),
  update: (id: string, data: Dict) => update<Dict>(`/personnel/attendance/${id}`, data),
  delete: (id: string) => del(`/personnel/attendance/${id}`),
};

// ─── Leave ───
export const LeaveApi = {
  list: () => list<Dict>('/personnel/leave'),
  create: (data: Dict) => create<Dict>('/personnel/leave', data),
  update: (id: string, data: Dict) => update<Dict>(`/personnel/leave/${id}`, data),
  delete: (id: string) => del(`/personnel/leave/${id}`),
};

// ─── Training ───
export const TrainingApi = {
  list: () => list<Dict>('/personnel/training'),
  create: (data: Dict) => create<Dict>('/personnel/training', data),
  update: (id: string, data: Dict) => update<Dict>(`/personnel/training/${id}`, data),
  delete: (id: string) => del(`/personnel/training/${id}`),
};

// ─── Equipment ───
export const EquipmentApi = {
  list: () => list<Dict>('/assets/equipment'),
  get: (id: string) => get<Dict>(`/assets/equipment/${id}`),
  create: (data: Dict) => create<Dict>('/assets/equipment', data),
  update: (id: string, data: Dict) => update<Dict>(`/assets/equipment/${id}`, data),
  delete: (id: string) => del(`/assets/equipment/${id}`),
};

// ─── Vehicles ───
export const VehiclesApi = {
  list: () => list<Dict>('/assets/vehicles'),
  get: (id: string) => get<Dict>(`/assets/vehicles/${id}`),
  create: (data: Dict) => create<Dict>('/assets/vehicles', data),
  update: (id: string, data: Dict) => update<Dict>(`/assets/vehicles/${id}`, data),
  delete: (id: string) => del(`/assets/vehicles/${id}`),
};

// ─── Maintenance ───
export const MaintenanceApi = {
  list: () => list<Dict>('/assets/maintenance'),
  create: (data: Dict) => create<Dict>('/assets/maintenance', data),
  update: (id: string, data: Dict) => update<Dict>(`/assets/maintenance/${id}`, data),
  delete: (id: string) => del(`/assets/maintenance/${id}`),
};

// ─── Fuel Logs ───
export const FuelApi = {
  list: () => list<Dict>('/assets/fuel'),
  create: (data: Dict) => create<Dict>('/assets/fuel', data),
  delete: (id: string) => del(`/assets/fuel/${id}`),
};

// ─── Establishments ───
export const EstablishmentsApi = {
  list: () => list<Dict>('/inspections/establishments'),
  get: (id: string) => get<Dict>(`/inspections/establishments/${id}`),
  create: (data: Dict) => create<Dict>('/inspections/establishments', data),
  update: (id: string, data: Dict) => update<Dict>(`/inspections/establishments/${id}`, data),
  delete: (id: string) => del(`/inspections/establishments/${id}`),
};

// ─── Inspections ───
export const InspectionsApi = {
  list: () => list<Dict>('/inspections/inspections'),
  create: (data: Dict) => create<Dict>('/inspections/inspections', data),
  update: (id: string, data: Dict) => update<Dict>(`/inspections/inspections/${id}`, data),
  delete: (id: string) => del(`/inspections/inspections/${id}`),
};

// ─── Certificates ───
export const CertificatesApi = {
  list: () => list<Dict>('/inspections/certificates'),
  create: (data: Dict) => create<Dict>('/inspections/certificates', data),
  update: (id: string, data: Dict) => update<Dict>(`/inspections/certificates/${id}`, data),
  delete: (id: string) => del(`/inspections/certificates/${id}`),
};

// ─── Violations ───
export const ViolationsApi = {
  list: () => list<Dict>('/inspections/violations'),
  create: (data: Dict) => create<Dict>('/inspections/violations', data),
  update: (id: string, data: Dict) => update<Dict>(`/inspections/violations/${id}`, data),
  delete: (id: string) => del(`/inspections/violations/${id}`),
};

// ─── Compliance (reuses violations API) ───
export const ComplianceApi = {
  list: () => list<Dict>('/compliance'),
  create: (data: Dict) => create<Dict>('/compliance', data),
  update: (id: string, data: Dict) => update<Dict>(`/compliance/${id}`, data),
  delete: (id: string) => del(`/compliance/${id}`),
};

// ─── Hydrants ───
export const HydrantsApi = {
  list: () => list<Dict>('/hydrants'),
  get: (id: string) => get<Dict>(`/hydrants/${id}`),
  create: (data: Dict) => create<Dict>('/hydrants', data),
  update: (id: string, data: Dict) => update<Dict>(`/hydrants/${id}`, data),
  delete: (id: string) => del(`/hydrants/${id}`),
};

// ─── Hydrant Inspections ───
export const HydrantInspectionsApi = {
  list: () => list<Dict>('/hydrants/inspections'),
  create: (data: Dict) => create<Dict>('/hydrants/inspections', data),
  update: (id: string, data: Dict) => update<Dict>(`/hydrants/inspections/${id}`, data),
  delete: (id: string) => del(`/hydrants/inspections/${id}`),
};

// ─── Incidents ───
export const IncidentsApi = {
  list: () => list<Dict>('/incidents'),
  get: (id: string) => get<Dict>(`/incidents/${id}`),
  create: (data: Dict) => create<Dict>('/incidents', data),
  updateStatus: (id: string, status: string) => update<Dict>(`/incidents/${id}/status`, { status }),
};

// ─── Documents ───
export const DocumentsApi = {
  list: () => list<Dict>('/documents'),
  get: (id: string) => get<Dict>(`/documents/${id}`),
  create: (data: Dict) => create<Dict>('/documents', data),
  update: (id: string, data: Dict) => update<Dict>(`/documents/${id}`, data),
  delete: (id: string) => del(`/documents/${id}`),
};

// ─── Document Routes ───
export const DocumentRoutesApi = {
  list: () => list<Dict>('/documents/routes'),
  create: (data: Dict) => create<Dict>('/documents/routes', data),
};

// ─── Community Programs ───
export const ProgramsApi = {
  list: () => list<Dict>('/community/programs'),
  get: (id: string) => get<Dict>(`/community/programs/${id}`),
  create: (data: Dict) => create<Dict>('/community/programs', data),
  update: (id: string, data: Dict) => update<Dict>(`/community/programs/${id}`, data),
  delete: (id: string) => del(`/community/programs/${id}`),
};

// ─── Program Participants ───
export const ParticipantsApi = {
  list: () => list<Dict>('/community/participants'),
  create: (data: Dict) => create<Dict>('/community/participants', data),
  update: (id: string, data: Dict) => update<Dict>(`/community/participants/${id}`, data),
  markAttended: (id: string, attended: boolean) => update<Dict>(`/community/participants/${id}/attended`, { attended }),
  delete: (id: string) => del(`/community/participants/${id}`),
};

// ─── Volunteers ───
export const VolunteersApi = {
  list: () => list<Dict>('/community/volunteers'),
  create: (data: Dict) => create<Dict>('/community/volunteers', data),
  update: (id: string, data: Dict) => update<Dict>(`/community/volunteers/${id}`, data),
  delete: (id: string) => del(`/community/volunteers/${id}`),
};

// ─── Service Requests ───
export const ServiceRequestsApi = {
  list: () => list<Dict>('/services/requests'),
  get: (id: string) => get<Dict>(`/services/requests/${id}`),
  create: (data: Dict) => create<Dict>('/services/requests', data),
  update: (id: string, data: Dict) => update<Dict>(`/services/requests/${id}`, data),
  delete: (id: string) => del(`/services/requests/${id}`),
};

// ─── Appointments ───
export const AppointmentsApi = {
  list: () => list<Dict>('/services/appointments'),
  get: (id: string) => get<Dict>(`/services/appointments/${id}`),
  create: (data: Dict) => create<Dict>('/services/appointments', data),
  update: (id: string, data: Dict) => update<Dict>(`/services/appointments/${id}`, data),
  delete: (id: string) => del(`/services/appointments/${id}`),
};

// ─── Hazard Reports ───
export const HazardReportsApi = {
  list: () => list<Dict>('/services/hazards'),
  get: (id: string) => get<Dict>(`/services/hazards/${id}`),
  create: (data: Dict) => create<Dict>('/services/hazards', data),
  update: (id: string, data: Dict) => update<Dict>(`/services/hazards/${id}`, data),
  delete: (id: string) => del(`/services/hazards/${id}`),
};

// ─── Reports ───
export const ReportsApi = {
  overview: () => get<Dict>('/reports/overview'),
  incidents: () => get<Dict>('/reports/incidents'),
  inspections: () => get<Dict>('/reports/inspections'),
  personnel: () => get<Dict>('/reports/personnel'),
};

// ─── Audit Logs ───
export const AuditApi = {
  list: (params?: Dict) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return get<{ items: Dict[]; total: number }>(`/audit${q}`);
  },
  modules: () => list<string>('/audit/modules'),
  actions: () => list<string>('/audit/actions'),
};

// ─── Health ───
export const health = () => get<{ status: string }>('/health');
