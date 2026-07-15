import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import PublicLayout from '@/layouts/PublicLayout';
import Dashboard from '@/admin/Dashboard';
import CommunityPrograms from '@/admin/community/CommunityPrograms';
import Outreach from '@/admin/community/Outreach';
import Volunteers from '@/admin/community/Volunteers';
import CommunityCalendar from '@/admin/community/Calendar';
import ServiceRequests from '@/admin/public-service/ServiceRequests';
import Appointments from '@/admin/public-service/Appointments';
import SeminarRegistrations from '@/admin/public-service/SeminarRegistrations';
import HazardReports from '@/admin/public-service/HazardReports';
import Login from '@/auth/Login';
import Register from '@/auth/Register';
import ForgotPassword from '@/auth/ForgotPassword';
import PublicHome from '@/public/pages/Home';
import PublicServices from '@/public/pages/Services';
import PublicSeminars from '@/public/pages/Seminars';
import PublicHazards from '@/public/pages/Hazards';
import PublicAppointments from '@/public/pages/Appointments';
import PublicInfo from '@/public/pages/Info';
import IncidentList from '@/admin/incidents/IncidentList';
import IncidentRecord from '@/admin/incidents/IncidentRecord';
import IncidentDetail from '@/admin/incidents/IncidentDetail';
import IncidentAnalytics from '@/admin/incidents/IncidentAnalytics';
import PersonnelList from '@/admin/personnel/PersonnelList';
import DutyRoster from '@/admin/personnel/DutyRoster';
import Attendance from '@/admin/personnel/Attendance';
import LeaveManagement from '@/admin/personnel/LeaveManagement';
import TrainingRecords from '@/admin/personnel/TrainingRecords';
import EquipmentList from '@/admin/equipment/EquipmentList';
import VehicleList from '@/admin/equipment/VehicleList';
import Maintenance from '@/admin/equipment/Maintenance';
import FuelMonitoring from '@/admin/equipment/FuelMonitoring';
import Establishments from '@/admin/inspections/Establishments';
import InspectionSchedule from '@/admin/inspections/InspectionSchedule';
import Certificates from '@/admin/inspections/Certificates';
import InspectionReports from '@/admin/inspections/InspectionReports';
import Compliance from '@/admin/compliance/Compliance';
import HydrantRegistry from '@/admin/hydrants/HydrantRegistry';
import GISMap from '@/admin/hydrants/GISMap';
import HydrantInspections from '@/admin/hydrants/HydrantInspections';
import Memoranda from '@/admin/documents/Memoranda';
import DocumentRepository from '@/admin/documents/DocumentRepository';
import IncomingDocuments from '@/admin/documents/IncomingDocuments';
import OutgoingDocuments from '@/admin/documents/OutgoingDocuments';
import ReportsDashboard from '@/admin/reports/ReportsDashboard';
import IncidentReports from '@/admin/reports/IncidentReports';
import ReportsInspectionReports from '@/admin/reports/InspectionReports';
import PersonnelReports from '@/admin/reports/PersonnelReports';
import Settings from '@/admin/Settings';
import UserManagement from '@/admin/UserManagement';
import AuditTrail from '@/admin/AuditTrail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/public" replace />} />
      <Route path="/public" element={<PublicLayout />}>
        <Route index element={<PublicHome />} />
        <Route path="services" element={<PublicServices />} />
        <Route path="appointments" element={<PublicAppointments />} />
        <Route path="seminars" element={<PublicSeminars />} />
        <Route path="hazards" element={<PublicHazards />} />
        <Route path="info" element={<PublicInfo />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot" element={<ForgotPassword />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="incidents" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="public-service" element={<ServiceRequests />} />
        <Route path="public-service/appointments" element={<Appointments />} />
        <Route path="public-service/seminars" element={<SeminarRegistrations />} />
        <Route path="public-service/hazards" element={<HazardReports />} />
        <Route path="inspections" element={<Establishments />} />
        <Route path="inspections/schedule" element={<InspectionSchedule />} />
        <Route path="inspections/certificates" element={<Certificates />} />
        <Route path="inspections/reports" element={<InspectionReports />} />
        <Route path="incidents" element={<IncidentList />} />
        <Route path="incidents/new" element={<IncidentRecord />} />
        <Route path="incidents/:id" element={<IncidentDetail />} />
        <Route path="incidents/analytics" element={<IncidentAnalytics />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="personnel" element={<PersonnelList />} />
        <Route path="personnel/roster" element={<DutyRoster />} />
        <Route path="personnel/attendance" element={<Attendance />} />
        <Route path="personnel/leave" element={<LeaveManagement />} />
        <Route path="personnel/training" element={<TrainingRecords />} />
        <Route path="equipment" element={<EquipmentList />} />
        <Route path="vehicles" element={<VehicleList />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="fuel" element={<FuelMonitoring />} />
        <Route path="hydrants" element={<HydrantRegistry />} />
        <Route path="hydrants/map" element={<GISMap />} />
        <Route path="hydrants/inspections" element={<HydrantInspections />} />
        <Route path="community" element={<CommunityPrograms />} />
        <Route path="community/outreach" element={<Outreach />} />
        <Route path="community/volunteers" element={<Volunteers />} />
        <Route path="community/calendar" element={<CommunityCalendar />} />
        <Route path="reports" element={<ReportsDashboard />} />
        <Route path="reports/incidents" element={<IncidentReports />} />
        <Route path="reports/inspections" element={<ReportsInspectionReports />} />
        <Route path="reports/personnel" element={<PersonnelReports />} />
        <Route path="documents" element={<DocumentRepository />} />
        <Route path="documents/incoming" element={<IncomingDocuments />} />
        <Route path="documents/outgoing" element={<OutgoingDocuments />} />
        <Route path="documents/memoranda" element={<Memoranda />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="audit" element={<AuditTrail />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
