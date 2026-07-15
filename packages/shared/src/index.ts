export type IncidentType =
  | 'Structural Fire' | 'Vehicle Fire' | 'Grass/Brush Fire'
  | 'Hazardous Materials' | 'Medical Emergency' | 'Rescue Operation'
  | 'False Alarm' | 'Gas Leak' | 'Electrical Fire'
  | 'Industrial Accident' | 'Building Collapse' | 'Flooding';

export type Severity = 'Minor' | 'Moderate' | 'Major' | 'Critical';

export type IncidentStatus =
  | 'New' | 'Dispatched' | 'On Scene' | 'Contained' | 'Closed';

export interface Incident {
  id: string;
  incidentNumber: string;
  type: IncidentType;
  severity: Severity;
  status: IncidentStatus;
  location: string;
  barangay: string;
  dateReported: Date;
  description: string | null;
  reporterName: string | null;
  reporterContact: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  stationId: string | null;
  isActive: boolean;
}

export type UserRole =
  | 'Public'
  | 'Station Commander'
  | 'Fire Officer';
