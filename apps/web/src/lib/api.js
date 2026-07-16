const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
async function request(path, init) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...init?.headers },
        ...init
    });
    if (!res.ok)
        throw new Error(`API error: ${res.status}`);
    if (res.status === 204)
        return undefined;
    return res.json();
}
function list(path) { return request(path); }
function get(path) { return request(path); }
function create(path, body) { return request(path, { method: 'POST', body: JSON.stringify(body) }); }
function update(path, body) { return request(path, { method: 'PATCH', body: JSON.stringify(body) }); }
function del(path) { return request(path, { method: 'DELETE' }); }
// ─── Users ───
export const UsersApi = {
    list: () => list('/users'),
    get: (id) => get(`/users/${id}`),
    create: (data) => create('/users', data),
    update: (id, data) => update(`/users/${id}`, data),
    delete: (id) => del(`/users/${id}`),
};
// ─── Personnel ───
export const PersonnelApi = {
    list: () => list('/personnel'),
    get: (id) => get(`/personnel/${id}`),
    create: (data) => create('/personnel', data),
    update: (id, data) => update(`/personnel/${id}`, data),
    delete: (id) => del(`/personnel/${id}`),
};
// ─── Shifts ───
export const ShiftsApi = {
    list: () => list('/personnel/shifts'),
    create: (data) => create('/personnel/shifts', data),
    update: (id, data) => update(`/personnel/shifts/${id}`, data),
    delete: (id) => del(`/personnel/shifts/${id}`),
};
// ─── Attendance ───
export const AttendanceApi = {
    list: () => list('/personnel/attendance'),
    create: (data) => create('/personnel/attendance', data),
    update: (id, data) => update(`/personnel/attendance/${id}`, data),
    delete: (id) => del(`/personnel/attendance/${id}`),
};
// ─── Leave ───
export const LeaveApi = {
    list: () => list('/personnel/leave'),
    create: (data) => create('/personnel/leave', data),
    update: (id, data) => update(`/personnel/leave/${id}`, data),
    delete: (id) => del(`/personnel/leave/${id}`),
};
// ─── Training ───
export const TrainingApi = {
    list: () => list('/personnel/training'),
    create: (data) => create('/personnel/training', data),
    update: (id, data) => update(`/personnel/training/${id}`, data),
    delete: (id) => del(`/personnel/training/${id}`),
};
// ─── Equipment ───
export const EquipmentApi = {
    list: () => list('/assets/equipment'),
    get: (id) => get(`/assets/equipment/${id}`),
    create: (data) => create('/assets/equipment', data),
    update: (id, data) => update(`/assets/equipment/${id}`, data),
    delete: (id) => del(`/assets/equipment/${id}`),
};
// ─── Vehicles ───
export const VehiclesApi = {
    list: () => list('/assets/vehicles'),
    get: (id) => get(`/assets/vehicles/${id}`),
    create: (data) => create('/assets/vehicles', data),
    update: (id, data) => update(`/assets/vehicles/${id}`, data),
    delete: (id) => del(`/assets/vehicles/${id}`),
};
// ─── Maintenance ───
export const MaintenanceApi = {
    list: () => list('/assets/maintenance'),
    create: (data) => create('/assets/maintenance', data),
    update: (id, data) => update(`/assets/maintenance/${id}`, data),
    delete: (id) => del(`/assets/maintenance/${id}`),
};
// ─── Fuel Logs ───
export const FuelApi = {
    list: () => list('/assets/fuel'),
    create: (data) => create('/assets/fuel', data),
    delete: (id) => del(`/assets/fuel/${id}`),
};
// ─── Establishments ───
export const EstablishmentsApi = {
    list: () => list('/inspections/establishments'),
    get: (id) => get(`/inspections/establishments/${id}`),
    create: (data) => create('/inspections/establishments', data),
    update: (id, data) => update(`/inspections/establishments/${id}`, data),
    delete: (id) => del(`/inspections/establishments/${id}`),
};
// ─── Inspections ───
export const InspectionsApi = {
    list: () => list('/inspections/inspections'),
    create: (data) => create('/inspections/inspections', data),
    update: (id, data) => update(`/inspections/inspections/${id}`, data),
    delete: (id) => del(`/inspections/inspections/${id}`),
};
// ─── Certificates ───
export const CertificatesApi = {
    list: () => list('/inspections/certificates'),
    create: (data) => create('/inspections/certificates', data),
    update: (id, data) => update(`/inspections/certificates/${id}`, data),
    delete: (id) => del(`/inspections/certificates/${id}`),
};
// ─── Violations ───
export const ViolationsApi = {
    list: () => list('/inspections/violations'),
    create: (data) => create('/inspections/violations', data),
    update: (id, data) => update(`/inspections/violations/${id}`, data),
    delete: (id) => del(`/inspections/violations/${id}`),
};
// ─── Compliance (reuses violations API) ───
export const ComplianceApi = {
    list: () => list('/compliance'),
    create: (data) => create('/compliance', data),
    update: (id, data) => update(`/compliance/${id}`, data),
    delete: (id) => del(`/compliance/${id}`),
};
// ─── Hydrants ───
export const HydrantsApi = {
    list: () => list('/hydrants'),
    get: (id) => get(`/hydrants/${id}`),
    create: (data) => create('/hydrants', data),
    update: (id, data) => update(`/hydrants/${id}`, data),
    delete: (id) => del(`/hydrants/${id}`),
};
// ─── Hydrant Inspections ───
export const HydrantInspectionsApi = {
    list: () => list('/hydrants/inspections'),
    create: (data) => create('/hydrants/inspections', data),
    update: (id, data) => update(`/hydrants/inspections/${id}`, data),
    delete: (id) => del(`/hydrants/inspections/${id}`),
};
// ─── Incidents ───
export const IncidentsApi = {
    list: () => list('/incidents'),
    get: (id) => get(`/incidents/${id}`),
    create: (data) => create('/incidents', data),
    updateStatus: (id, status) => update(`/incidents/${id}/status`, { status }),
};
// ─── Documents ───
export const DocumentsApi = {
    list: () => list('/documents'),
    get: (id) => get(`/documents/${id}`),
    create: (data) => create('/documents', data),
    update: (id, data) => update(`/documents/${id}`, data),
    delete: (id) => del(`/documents/${id}`),
};
// ─── Document Routes ───
export const DocumentRoutesApi = {
    list: () => list('/documents/routes'),
    create: (data) => create('/documents/routes', data),
};
// ─── Community Programs ───
export const ProgramsApi = {
    list: () => list('/community/programs'),
    get: (id) => get(`/community/programs/${id}`),
    create: (data) => create('/community/programs', data),
    update: (id, data) => update(`/community/programs/${id}`, data),
    delete: (id) => del(`/community/programs/${id}`),
};
// ─── Program Participants ───
export const ParticipantsApi = {
    list: () => list('/community/participants'),
    create: (data) => create('/community/participants', data),
    update: (id, data) => update(`/community/participants/${id}`, data),
    markAttended: (id, attended) => update(`/community/participants/${id}/attended`, { attended }),
    delete: (id) => del(`/community/participants/${id}`),
};
// ─── Volunteers ───
export const VolunteersApi = {
    list: () => list('/community/volunteers'),
    create: (data) => create('/community/volunteers', data),
    update: (id, data) => update(`/community/volunteers/${id}`, data),
    delete: (id) => del(`/community/volunteers/${id}`),
};
// ─── Service Requests ───
export const ServiceRequestsApi = {
    list: () => list('/services/requests'),
    get: (id) => get(`/services/requests/${id}`),
    create: (data) => create('/services/requests', data),
    update: (id, data) => update(`/services/requests/${id}`, data),
    delete: (id) => del(`/services/requests/${id}`),
};
// ─── Appointments ───
export const AppointmentsApi = {
    list: () => list('/services/appointments'),
    get: (id) => get(`/services/appointments/${id}`),
    create: (data) => create('/services/appointments', data),
    update: (id, data) => update(`/services/appointments/${id}`, data),
    delete: (id) => del(`/services/appointments/${id}`),
};
// ─── Hazard Reports ───
export const HazardReportsApi = {
    list: () => list('/services/hazards'),
    get: (id) => get(`/services/hazards/${id}`),
    create: (data) => create('/services/hazards', data),
    update: (id, data) => update(`/services/hazards/${id}`, data),
    delete: (id) => del(`/services/hazards/${id}`),
};
// ─── Reports ───
export const ReportsApi = {
    overview: () => get('/reports/overview'),
    incidents: () => get('/reports/incidents'),
    inspections: () => get('/reports/inspections'),
    personnel: () => get('/reports/personnel'),
};
// ─── Audit Logs ───
export const AuditApi = {
    list: (params) => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        return get(`/audit${q}`);
    },
    modules: () => list('/audit/modules'),
    actions: () => list('/audit/actions'),
};
// ─── Health ───
export const health = () => get('/health');
