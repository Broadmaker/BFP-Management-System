export interface NavItem {
  key: string;
  label: string;
  href?: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export interface Incident {
  id: string;
  incidentNumber: string;
  type: IncidentType;
  severity: Severity;
  status: IncidentStatus;
  location: string;
  barangay: string;
  dateReported: string;
  description: string;
  reporterName: string;
  reporterContact: string;
}

export type IncidentType =
  | 'Structural Fire'
  | 'Vehicle Fire'
  | 'Grass/Brush Fire'
  | 'Hazardous Materials'
  | 'Medical Emergency'
  | 'Rescue Operation'
  | 'False Alarm'
  | 'Gas Leak'
  | 'Electrical Fire'
  | 'Industrial Accident'
  | 'Building Collapse'
  | 'Flooding';

export type Severity = 'Minor' | 'Moderate' | 'Major' | 'Critical';
export type IncidentStatus =
  | 'New'
  | 'Dispatched'
  | 'On Scene'
  | 'Contained'
  | 'Closed';
