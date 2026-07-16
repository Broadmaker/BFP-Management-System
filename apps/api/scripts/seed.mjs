#!/usr/bin/env node

const BASE = 'https://bfp-station-api.sanigkram24.workers.dev';

function uuid() {
  return crypto.randomUUID();
}

function now(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

function dateStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    console.error(`  ✗ ${path}:`, data.error || res.status, body);
    return null;
  }
  console.log(`  ✓ ${path} → ${data.id || data.title || data.name || '(ok)'}`);
  return data;
}

async function main() {
  console.log('\n=== Seeding BFP Station Management System ===\n');

  // ─── 1. USERS ───
  console.log('── Users ──');
  const admin = await post('/api/users', {
    email: 'admin@bfp.gov.ph',
    name: 'Johnny R. Santos',
    password: 'admin123',
    role: 'Fire Chief',
    rank: 'SUPT',
    position: 'Station Commander',
    contactNumber: '09171234567',
    isActive: true,
  });
  const capt = await post('/api/users', {
    email: 'captain@bfp.gov.ph',
    name: 'Maria L. Reyes',
    password: 'pass123',
    role: 'Fire Officer',
    rank: 'CAPT',
    position: 'Deputy Commander',
    contactNumber: '09172345678',
    isActive: true,
  });
  const sinsp = await post('/api/users', {
    email: 'sinspector@bfp.gov.ph',
    name: 'Carlos M. Dimagiba',
    password: 'pass123',
    role: 'Fire Inspector',
    rank: 'SINSP',
    position: 'Senior Inspector',
    contactNumber: '09173456789',
    isActive: true,
  });
  const insp = await post('/api/users', {
    email: 'inspector@bfp.gov.ph',
    name: 'Ana Marie T. Cruz',
    password: 'pass123',
    role: 'Fire Inspector',
    rank: 'INSP',
    position: 'Fire Safety Inspector',
    contactNumber: '09174567890',
    isActive: true,
  });
  const fo1 = await post('/api/users', {
    email: 'fo1@bfp.gov.ph',
    name: 'Pedro D. Bautista',
    password: 'pass123',
    role: 'Fire Officer',
    rank: 'FO1',
    position: 'Fire Fighter',
    contactNumber: '09175678901',
    isActive: true,
  });
  const fo2 = await post('/api/users', {
    email: 'fo2@bfp.gov.ph',
    name: 'Luisa G. Hernandez',
    password: 'pass123',
    role: 'Fire Officer',
    rank: 'FO2',
    position: 'Fire Fighter',
    contactNumber: '09176789012',
    isActive: true,
  });
  const nur = await post('/api/users', {
    email: 'nurse@bfp.gov.ph',
    name: 'Dr. Ramon P. Villanueva',
    password: 'pass123',
    role: 'Medical Officer',
    rank: 'CIVILIAN',
    position: 'Station Nurse',
    contactNumber: '09177890123',
    isActive: true,
  });
  const clerk = await post('/api/users', {
    email: 'clerk@bfp.gov.ph',
    name: 'Elena S. Mercado',
    password: 'pass123',
    role: 'Administrative',
    rank: 'CIVILIAN',
    position: 'Records Clerk',
    contactNumber: '09178901234',
    isActive: true,
  });

  const userIds = { admin, capt, sinsp, insp, fo1, fo2, nur, clerk };
  // Filter out any null values (failed creates)
  for (const k of Object.keys(userIds)) {
    if (!userIds[k]) {
      console.error(`FATAL: user ${k} was not created. Aborting.`);
      process.exit(1);
    }
  }

  // ─── 2. PERSONNEL ───
  console.log('\n── Personnel ──');
  const p1 = await post('/api/personnel', {
    userId: admin.id, employeeNumber: 'BFP-2024-001',
    rank: 'SUPT', position: 'Station Commander', assignment: 'Administration',
    contactNumber: '09171234567', dateHired: dateStr(-365 * 15), isActive: true,
  });
  const p2 = await post('/api/personnel', {
    userId: capt.id, employeeNumber: 'BFP-2024-002',
    rank: 'CAPT', position: 'Deputy Commander', assignment: 'Operations',
    contactNumber: '09172345678', dateHired: dateStr(-365 * 12), isActive: true,
  });
  const p3 = await post('/api/personnel', {
    userId: sinsp.id, employeeNumber: 'BFP-2024-003',
    rank: 'SINSP', position: 'Senior Fire Inspector', assignment: 'Fire Safety Enforcement',
    contactNumber: '09173456789', dateHired: dateStr(-365 * 10), isActive: true,
  });
  const p4 = await post('/api/personnel', {
    userId: insp.id, employeeNumber: 'BFP-2024-004',
    rank: 'INSP', position: 'Fire Safety Inspector', assignment: 'Inspection',
    contactNumber: '09174567890', dateHired: dateStr(-365 * 6), isActive: true,
  });
  const p5 = await post('/api/personnel', {
    userId: fo1.id, employeeNumber: 'BFP-2024-005',
    rank: 'FO1', position: 'Fire Fighter', assignment: 'Fire Suppression',
    contactNumber: '09175678901', dateHired: dateStr(-365 * 4), isActive: true,
  });
  const p6 = await post('/api/personnel', {
    userId: fo2.id, employeeNumber: 'BFP-2024-006',
    rank: 'FO2', position: 'Fire Fighter', assignment: 'Fire Suppression',
    contactNumber: '09176789012', dateHired: dateStr(-365 * 2), isActive: true,
  });
  const p7 = await post('/api/personnel', {
    userId: nur.id, employeeNumber: 'BFP-2024-007',
    rank: 'CIVILIAN', position: 'Medical Officer', assignment: 'EMS',
    contactNumber: '09177890123', dateHired: dateStr(-365 * 8), isActive: true,
  });
  const p8 = await post('/api/personnel', {
    userId: clerk.id, employeeNumber: 'BFP-2024-008',
    rank: 'CIVILIAN', position: 'Records Clerk', assignment: 'Administration',
    contactNumber: '09178901234', dateHired: dateStr(-365 * 3), isActive: true,
  });
  // Inactive personnel
  const p9 = await post('/api/personnel', {
    employeeNumber: 'BFP-2024-009',
    rank: 'FO1', position: 'Fire Fighter', assignment: 'Fire Suppression',
    contactNumber: '09179012345', dateHired: dateStr(-365 * 5), isActive: false,
  });

  const personnelIds = [p1, p2, p3, p4, p5, p6, p7, p8, p9].filter(Boolean);

  // ─── 3. SHIFT SCHEDULES ───
  console.log('\n── Shift Schedules ──');
  const shiftTypes = ['Day', 'Night', 'Off'];
  for (const person of personnelIds.slice(0, 6)) {
    for (let d = -7; d <= 7; d++) {
      await post('/api/personnel/shifts', {
        personnelId: person.id,
        shiftDate: dateStr(d),
        shiftType: shiftTypes[Math.abs(d) % 3],
        startTime: Math.abs(d) % 3 === 0 ? '08:00' : Math.abs(d) % 3 === 1 ? '20:00' : null,
        endTime: Math.abs(d) % 3 === 0 ? '20:00' : Math.abs(d) % 3 === 1 ? '08:00' : null,
      });
    }
  }

  // ─── 4. ATTENDANCE ───
  console.log('\n── Attendance ──');
  for (let d = -10; d <= -1; d++) {
    for (const person of personnelIds.slice(0, 5)) {
      await post('/api/personnel/attendance', {
        personnelId: person.id,
        date: dateStr(d),
        type: 'Regular',
        timeIn: '07:55',
        timeOut: '17:05',
        remarks: Math.random() > 0.8 ? 'Overtime - report completion' : '',
      });
    }
  }

  // ─── 5. LEAVE REQUESTS ───
  console.log('\n── Leave Requests ──');
  const leaveTypes = ['Vacation', 'Sick', 'Personal', 'Maternity', 'Paternity'];
  for (const person of personnelIds.slice(0, 4)) {
    await post('/api/personnel/leave', {
      personnelId: person.id,
      type: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
      startDate: dateStr(14),
      endDate: dateStr(16),
      reason: 'Personal matter',
      status: Math.random() > 0.5 ? 'Approved' : 'Pending',
      approvedById: admin.id,
      createdAt: now(-3),
    });
  }

  // ─── 6. TRAINING ───
  console.log('\n── Training ──');
  const trainingData = [
    { title: 'Basic Fire Fighting', provider: 'BFP Training Institute', cert: 'BFP-BFF-001' },
    { title: 'Hazmat Response Level 1', provider: 'NDRRMC', cert: 'NDRRMC-HM-001' },
    { title: 'Emergency Medical Response', provider: 'DOH', cert: 'DOH-EMR-001' },
    { title: 'Rope Rescue Techniques', provider: 'BFP NCR', cert: 'BFP-RR-001' },
    { title: 'Incident Command System', provider: 'BFP Academy', cert: 'BFP-ICS-001' },
  ];
  for (const person of personnelIds.slice(0, 5)) {
    for (let i = 0; i < 2; i++) {
      const t = trainingData[(personnelIds.indexOf(person) + i) % trainingData.length];
      await post('/api/personnel/training', {
        personnelId: person.id,
        title: t.title,
        provider: t.provider,
        completedDate: dateStr(-365 * (1 + i)),
        expiryDate: dateStr(365 * 2 - 365 * i),
        certificateUrl: t.cert,
      });
    }
  }

  // ─── 7. EQUIPMENT ───
  console.log('\n── Equipment ──');
  const equipItems = [
    { name: 'SCBA Set', category: 'Breathing Apparatus', sn: 'SCBA-24001', loc: 'Station 1 Bay', pid: p1 },
    { name: 'Thermal Imaging Camera', category: 'Detection', sn: 'TIC-24002', loc: 'Station 1 Bay', pid: null },
    { name: 'Hydraulic Extrication Tool', category: 'Rescue', sn: 'HET-24003', loc: 'Vehicle 1', pid: p5 },
    { name: 'Portable Fire Extinguisher (ABC)', category: 'Suppression', sn: 'PFE-24004', loc: 'Admin Office', pid: null },
    { name: 'Fire Hose (2.5" x 50ft)', category: 'Suppression', sn: 'FH-24005', loc: 'Station 1 Bay', pid: p5 },
    { name: 'Portable Generator 5kVA', category: 'Utility', sn: 'GEN-24006', loc: 'Storage Room', pid: null },
    { name: 'Chainsaw', category: 'Rescue', sn: 'CS-24007', loc: 'Vehicle 2', pid: p6 },
    { name: 'Ventilator Fan', category: 'Ventilation', sn: 'VF-24008', loc: 'Station 1 Bay', pid: null },
    { name: 'Rope Bag 100ft', category: 'Rescue', sn: 'RB-24009', loc: 'Vehicle 1', pid: p5 },
    { name: 'Gas Detector', category: 'Detection', sn: 'GD-24010', loc: 'Station 1 Bay', pid: null },
    { name: 'AED (Defibrillator)', category: 'Medical', sn: 'AED-24011', loc: 'EMS Room', pid: p7 },
    { name: 'Stretcher', category: 'Medical', sn: 'STR-24012', loc: 'EMS Room', pid: p7 },
    { name: 'Communication Radio', category: 'Communications', sn: 'RAD-24013', loc: 'Dispatch Center', pid: p2 },
    { name: 'Laptop (Incident Command)', category: 'IT Equipment', sn: 'LAP-24014', loc: 'Admin Office', pid: null },
    { name: 'Drone (Thermal)', category: 'Detection', sn: 'DRN-24015', loc: 'Storage Room', pid: null },
  ];
  for (const eq of equipItems) {
    await post('/api/assets/equipment', {
      name: eq.name, category: eq.category, serialNumber: eq.sn,
      status: 'Operational', location: eq.loc, assignedTo: eq.pid?.id || null,
      purchaseDate: dateStr(-730), lastMaintenanceDate: dateStr(-60), nextMaintenanceDate: dateStr(90),
    });
  }

  // ─── 8. VEHICLES ───
  console.log('\n── Vehicles ──');
  const v1 = await post('/api/assets/vehicles', {
    name: 'BFP Fire Truck 1', plateNumber: 'SGW-1234', type: 'Fire Engine',
    status: 'Available', assignedCrew: 'Alpha Team', mileage: 12450,
    lastMaintenanceDate: dateStr(-30), nextMaintenanceDate: dateStr(60),
  });
  const v2 = await post('/api/assets/vehicles', {
    name: 'BFP Fire Truck 2', plateNumber: 'SGW-5678', type: 'Ladder Truck',
    status: 'Available', assignedCrew: 'Bravo Team', mileage: 8930,
    lastMaintenanceDate: dateStr(-45), nextMaintenanceDate: dateStr(45),
  });
  const v3 = await post('/api/assets/vehicles', {
    name: 'BFP Ambulance', plateNumber: 'SGW-9012', type: 'Ambulance',
    status: 'Available', assignedCrew: 'Medical Team', mileage: 22100,
    lastMaintenanceDate: dateStr(-15), nextMaintenanceDate: dateStr(75),
  });
  const v4 = await post('/api/assets/vehicles', {
    name: 'BFP Rescue Van', plateNumber: 'SGW-3456', type: 'Rescue Vehicle',
    status: 'In Maintenance', assignedCrew: 'Rescue Team', mileage: 18670,
    lastMaintenanceDate: dateStr(-5), nextMaintenanceDate: dateStr(25),
  });
  const v5 = await post('/api/assets/vehicles', {
    name: 'BFP Command Car', plateNumber: 'SGW-7890', type: 'Utility',
    status: 'Available', assignedCrew: 'Command Staff', mileage: 5620,
    lastMaintenanceDate: dateStr(-90), nextMaintenanceDate: dateStr(90),
  });

  const vehicles = [v1, v2, v3, v4, v5].filter(Boolean);

  // ─── 9. MAINTENANCE ───
  console.log('\n── Maintenance ──');
  await post('/api/assets/maintenance', {
    assetType: 'Vehicle', assetId: v4.id,
    type: 'Engine Overhaul', description: 'Complete engine check and oil change',
    performedDate: dateStr(-5), performedById: fo1.id, cost: 15000, nextScheduledDate: dateStr(180),
  });
  await post('/api/assets/maintenance', {
    assetType: 'Equipment', assetId: (await (await fetch(`${BASE}/api/assets/equipment`)).json())[2]?.id || 'unknown',
    type: 'Calibration', description: 'Hydraulic pressure calibration',
    performedDate: dateStr(-10), performedById: fo2.id, cost: 3000, nextScheduledDate: dateStr(90),
  });
  await post('/api/assets/maintenance', {
    assetType: 'Vehicle', assetId: v1.id,
    type: 'Routine', description: 'Oil change and tire rotation',
    performedDate: dateStr(-30), performedById: fo1.id, cost: 5000, nextScheduledDate: dateStr(90),
  });

  // ─── 10. FUEL LOGS ───
  console.log('\n── Fuel Logs ──');
  for (const v of vehicles) {
    for (let d = -14; d <= 0; d += 7) {
      await post('/api/assets/fuel', {
        vehicleId: v.id, date: dateStr(d), liters: Math.floor(40 + Math.random() * 60),
        cost: Math.floor(2000 + Math.random() * 3000), mileage: (v.mileage || 5000) + Math.floor(Math.random() * 200), remarks: '',
      });
    }
  }

  // ─── 11. ESTABLISHMENTS ───
  console.log('\n── Establishments ──');
  const establData = [
    { bn: 'SM Mall Manila', ow: 'Henry Sy Jr.', oc: '09181234567', addr: 'San Lazaro St', brgy: 'Barangay 1', oct: 'Business', cls: 'Large', cs: 'Compliant' },
    { bn: "McDonald's Makati", ow: 'George T. Yang', oc: '09182345678', addr: 'Ayala Ave', brgy: 'Barangay 2', oct: 'Business', cls: 'Medium', cs: 'Compliant' },
    { bn: 'St. Mary\'s Hospital', ow: 'Dr. Jose R. Dela Cruz', oc: '09183456789', addr: 'Taft Ave', brgy: 'Barangay 3', oct: 'Institutional', cls: 'Large', cs: 'Compliant' },
    { bn: 'Green Heights Condo', ow: 'DMCI Homes', oc: '09184567890', addr: 'EDSA', brgy: 'Barangay 4', oct: 'Residential', cls: 'High-Rise', cs: 'Pending' },
    { bn: 'Jollibee Plaza', ow: 'Tony Tan Caktiong', oc: '09185678901', addr: 'Ortigas Ave', brgy: 'Barangay 5', oct: 'Business', cls: 'Medium', cs: 'Compliant' },
    { bn: 'Sunrise School Inc.', ow: 'Dr. Maria Makiling', oc: '09186789012', addr: 'Katipunan Rd', brgy: 'Barangay 1', oct: 'Educational', cls: 'Medium', cs: 'Non-Compliant' },
    { bn: 'Puregold Supermarket', ow: 'Lucio Co', oc: '09187890123', addr: 'Rizal Ave', brgy: 'Barangay 2', oct: 'Business', cls: 'Large', cs: 'Compliant' },
    { bn: 'Shell Gas Station', ow: 'Pilipinas Shell', oc: '09188901234', addr: 'North Luzon Expwy', brgy: 'Barangay 3', oct: 'Business', cls: 'Medium', cs: 'Compliant' },
    { bn: 'City Hall Manila', ow: 'Mayor Office', oc: '09189012345', addr: 'Padre Burgos St', brgy: 'Barangay 4', oct: 'Government', cls: 'Large', cs: 'Compliant' },
    { bn: 'ABC Warehouse Club', ow: 'John Gokongwei', oc: '09190123456', addr: 'C5 Road', brgy: 'Barangay 5', oct: 'Business', cls: 'Large', cs: 'Pending' },
  ];
  const establishments = [];
  for (const e of establData) {
    const est = await post('/api/inspections/establishments', {
      businessName: e.bn, ownerName: e.ow, ownerContact: e.oc,
      address: e.addr, barangay: e.brgy, occupancyType: e.oct,
      classification: e.cls, complianceStatus: e.cs,
    });
    if (est) establishments.push(est);
  }

  // ─── 12. INSPECTIONS ───
  console.log('\n── Inspections ──');
  const inspResults = ['Passed', 'Conditional Pass', 'Failed', 'Passed', 'Passed'];
  for (const est of establishments.slice(0, 6)) {
    await post('/api/inspections/inspections', {
      establishmentId: est.id, inspectorId: insp.id,
      scheduledDate: dateStr(-30), completedDate: dateStr(-28),
      result: inspResults[Math.floor(Math.random() * inspResults.length)],
      notes: 'Routine fire safety inspection conducted. ' + (Math.random() > 0.5 ? 'Minor violations noted.' : 'All requirements compliant.'),
    });
  }

  // ─── 13. CERTIFICATES ───
  console.log('\n── Certificates (FSIC) ──');
  for (const est of establishments.slice(0, 5)) {
    await post('/api/inspections/certificates', {
      establishmentId: est.id,
      certificateNumber: `FSIC-2025-${String(establishments.indexOf(est) + 1).padStart(4, '0')}`,
      issuedDate: dateStr(-180), expiryDate: dateStr(185),
      status: est.complianceStatus === 'Compliant' ? 'Active' : 'Pending',
      issuedById: sinsp.id,
    });
  }

  // ─── 14. VIOLATIONS ───
  console.log('\n── Violations ──');
  const violDescriptions = [
    'Blocked fire exit on 2nd floor', 'Expired fire extinguishers found',
    'No emergency lighting in stairwell', 'Improper storage of flammable materials',
    'Missing fire alarm system', 'Exceeding maximum occupancy limit',
    'Inadequate fire safety signage', 'Uncertified electrical wiring',
    'Fire sprinkler system not functional', 'Escape route obstructed',
  ];
  for (let i = 0; i < 5; i++) {
    const est = establishments[i % establishments.length];
    await post('/api/inspections/violations', {
      establishmentId: est.id, description: violDescriptions[i],
      noticeDate: dateStr(-15), complianceDeadline: dateStr(15),
      status: i < 2 ? 'Open' : 'Resolved',
      correctiveActions: i < 2 ? '' : 'Violation has been corrected after re-inspection.',
      resolvedAt: i < 2 ? null : dateStr(-5),
    });
  }

  // ─── 15. HYDRANTS ───
  console.log('\n── Hydrants ──');
  const hydrantLocations = [
    ['14.5995', '120.9842', 'Barangay 1'], ['14.6010', '120.9850', 'Barangay 2'],
    ['14.6025', '120.9865', 'Barangay 3'], ['14.6040', '120.9880', 'Barangay 4'],
    ['14.6055', '120.9895', 'Barangay 5'], ['14.6070', '120.9910', 'Barangay 1'],
    ['14.6085', '120.9925', 'Barangay 2'], ['14.6100', '120.9940', 'Barangay 3'],
    ['14.6115', '120.9955', 'Barangay 4'], ['14.6130', '120.9970', 'Barangay 5'],
  ];
  const hydrants = [];
  for (let i = 0; i < 10; i++) {
    const h = await post('/api/hydrants', {
      hydrantId: `HYD-${String(i + 1).padStart(4, '0')}`,
      gpsLatitude: hydrantLocations[i][0], gpsLongitude: hydrantLocations[i][1],
      barangay: hydrantLocations[i][2],
      street: `${['Rizal St', 'Bonifacio Ave', 'Mabini Rd', 'Luna St', 'Jacinto Blvd'][i % 5]} corner ${['Del Pilar', 'Aguinaldo'][i % 2]}`,
      installationDate: dateStr(-730), status: i < 8 ? 'Operational' : 'Under Repair',
      ownership: i < 7 ? 'City Government' : 'Private', waterPressure: 40 + Math.floor(Math.random() * 30),
      lastInspectedDate: dateStr(-30),
    });
    if (h) hydrants.push(h);
  }

  // ─── 16. HYDRANT INSPECTIONS ───
  console.log('\n── Hydrant Inspections ──');
  for (const h of hydrants.slice(0, 5)) {
    await post('/api/hydrants/inspections', {
      hydrantId: h.id, inspectedById: insp.id,
      inspectedDate: dateStr(-15), waterPressure: 45 + Math.floor(Math.random() * 20),
      isOperational: true, remarks: 'Hydrant is in good working condition.',
    });
  }

  // ─── 17. INCIDENTS ───
  console.log('\n── Incidents ──');
  const incidentData = [
    { in: 'BFP-2025-001', type: 'Structural Fire', sev: 'High', loc: '123 Rizal St, Barangay 1', brgy: 'Barangay 1', desc: 'Two-story residential building fire. Occupants evacuated safely.', repName: 'Maria Santos', repContact: '09199990001' },
    { in: 'BFP-2025-002', type: 'Grass Fire', sev: 'Low', loc: 'Lot 5, Bonifacio Ave', brgy: 'Barangay 2', desc: 'Open lot grass fire, approximately 100sqm.', repName: 'John Doe', repContact: '09199990002' },
    { in: 'BFP-2025-003', type: 'Vehicular Accident', sev: 'Medium', loc: 'EDSA corner North Ave', brgy: 'Barangay 3', desc: 'Three-vehicle collision with minor fire. One person trapped.', repName: 'Dispatch Center', repContact: '09199990003' },
    { in: 'BFP-2025-004', type: 'Hazmat Spill', sev: 'High', loc: 'Industrial Zone Phase 2', brgy: 'Barangay 4', desc: 'Chemical spill from a manufacturing plant. Evacuation of 500m radius.', repName: 'Plant Manager', repContact: '09199990004' },
    { in: 'BFP-2025-005', type: 'Structural Fire', sev: 'Critical', loc: 'Green Heights Condo Unit 12F', brgy: 'Barangay 4', desc: 'High-rise residential fire on 12th floor. Multiple units affected.', repName: 'Building Security', repContact: '09199990005' },
    { in: 'BFP-2025-006', type: 'Medical Rescue', sev: 'Medium', loc: 'Public Market, Barangay 5', brgy: 'Barangay 5', desc: 'Cardiac arrest patient at public market. BFP EMS responded.', repName: 'Market Vendor Assoc', repContact: '09199990006' },
  ];
  const incidents = [];
  for (const inc of incidentData) {
    const rec = await post('/api/incidents', {
      incidentNumber: inc.in, type: inc.type, severity: inc.sev, status: 'Closed',
      location: inc.loc, barangay: inc.brgy, occupancyType: 'Residential',
      description: inc.desc, reporterName: inc.repName, reporterContact: inc.repContact,
      reportedById: capt.id, dateReported: dateStr(-30 + incidentData.indexOf(inc)),
    });
    if (rec) incidents.push(rec);
  }

  // ─── 18. COMMUNITY PROGRAMS ───
  console.log('\n── Community Programs ──');
  const programs = [
    { title: 'Fire Safety Seminar - Barangay 1', type: 'Seminar', desc: 'Basic fire safety awareness for residents', loc: 'Barangay Hall', brgy: 'Barangay 1', sched: dateStr(10), sta: 'Scheduled' },
    { title: 'Earthquake Drill 2025', type: 'Drill', desc: 'Community-wide earthquake preparedness drill', loc: 'Plaza Mayor', brgy: 'Barangay 2', sched: dateStr(20), sta: 'Scheduled' },
    { title: 'Fire Prevention Month Kick-off', type: 'Campaign', desc: 'March is Fire Prevention Month - opening ceremony', loc: 'City Hall Grounds', brgy: 'Barangay 3', sched: dateStr(45), sta: 'Planned' },
    { title: 'BFP Open House', type: 'Event', desc: 'Station tour and fire truck display for kids', loc: 'BFP Station 1', brgy: 'Barangay 4', sched: dateStr(5), sta: 'Scheduled' },
    { title: 'Home Fire Safety Visit', type: 'Outreach', desc: 'Door-to-door fire safety inspection and education', loc: 'Various homes', brgy: 'Barangay 5', sched: dateStr(-10), sta: 'Completed' },
  ];
  for (const prog of programs) {
    const p = await post('/api/community/programs', {
      title: prog.title, type: prog.type, description: prog.desc,
      location: prog.loc, barangay: prog.brgy, scheduledDate: prog.sched,
      status: prog.sta, conductedById: sinsp.id,
    });
    // Add participants
    if (p) {
      for (let i = 1; i <= 5; i++) {
        await post('/api/community/participants', {
          programId: p.id, name: `Resident ${i}`, contactNumber: `091700000${i}`,
          email: `resident${i}@email.com`, attended: prog.sta === 'Completed' ? Math.random() > 0.3 : false,
        });
      }
    }
  }

  // ─── 19. VOLUNTEERS ───
  console.log('\n── Volunteers ──');
  const volunteerData = [
    { name: 'Andres Bonifacio', contact: '09181111111', email: 'andres.b@email.com', brgy: 'Barangay 1', skills: 'First Aid, Rescue' },
    { name: 'Gabriela Silang', contact: '09182222222', email: 'gabriela.s@email.com', brgy: 'Barangay 2', skills: 'Fire Safety, Communications' },
    { name: 'Jose Rizal', contact: '09183333333', email: 'jose.r@email.com', brgy: 'Barangay 3', skills: 'Medical, Leadership' },
    { name: 'Melchora Aquino', contact: '09184444444', email: 'melchora.a@email.com', brgy: 'Barangay 4', skills: 'Community Organizing' },
    { name: 'Lapu-Lapu', contact: '09185555555', email: 'lapu.l@email.com', brgy: 'Barangay 5', skills: 'Rescue, Swimming' },
    { name: 'Emilio Aguinaldo', contact: '09186666666', email: 'emilio.a@email.com', brgy: 'Barangay 1', skills: 'Logistics, Driving' },
  ];
  for (const v of volunteerData) {
    await post('/api/community/volunteers', {
      name: v.name, contactNumber: v.contact, email: v.email,
      barangay: v.brgy, skills: v.skills, trainingCompleted: Math.random() > 0.4, isActive: true,
    });
  }

  // ─── 20. SERVICE REQUESTS ───
  console.log('\n── Service Requests ──');
  const srData = [
    { type: 'Fire Safety Inspection Request', requester: 'Juan Dela Cruz', business: 'Sari-Sari Store', contact: '09181111112' },
    { type: 'FSIC Application', requester: 'Maria Clara', business: 'Clara\'s Restaurant', contact: '09182222223' },
    { type: 'Fire Clearance', requester: 'Noli Me Tangere Corp', business: 'Noli Enterprises', contact: '09183333334' },
    { type: 'Complaint - No Fire Exit', requester: 'Krislyn Santos', business: 'Sunrise Mall', contact: '09184444445' },
    { type: 'Request for Fire Truck', requester: 'Brgy Captain Reyes', business: 'Barangay 4', contact: '09185555556' },
  ];
  for (const sr of srData) {
    await post('/api/services/requests', {
      type: sr.type, requester: sr.requester, business: sr.business,
      contact: sr.contact, status: Math.random() > 0.5 ? 'Pending' : 'Completed',
    });
  }

  // ─── 21. APPOINTMENTS ───
  console.log('\n── Appointments ──');
  const apptData = [
    { name: 'Antonio Luna', business: 'Luna Construction', type: 'FSIC Application', date: dateStr(3), time: '09:00', address: 'Construction Site A' },
    { name: 'Apolinario Mabini', business: '', type: 'Fire Clearance', date: dateStr(3), time: '10:30', address: 'City Hall' },
    { name: 'Marcelo H. Del Pilar', business: 'Del Pilar Printing', type: 'Inspection Request', date: dateStr(4), time: '14:00', address: 'Printing Press Bldg' },
    { name: 'Emilio Jacinto', business: 'Jacinto Trading', type: 'Consultation', date: dateStr(5), time: '08:30', address: 'Trading Post' },
    { name: 'Graciano Lopez Jaena', business: '', type: 'Document Request', date: dateStr(5), time: '13:00', address: 'BFP Station 1' },
  ];
  for (const a of apptData) {
    await post('/api/services/appointments', {
      name: a.name, business: a.business, type: a.type, date: a.date, time: a.time, address: a.address, status: 'Scheduled',
    });
  }

  // ─── 22. HAZARD REPORTS ───
  console.log('\n── Hazard Reports ──');
  const hazData = [
    { type: 'Fire Hazard', loc: 'Abandoned building at Mabini St', brgy: 'Barangay 1', rep: 'Concerned Citizen', pri: 'High' },
    { type: 'Electrical Fire Risk', loc: 'Old commercial building, Rizal Ave', brgy: 'Barangay 2', rep: 'Tenant Association', pri: 'Medium' },
    { type: 'Gas Leak', loc: 'Near public market', brgy: 'Barangay 3', rep: 'Market Vendor', pri: 'Critical' },
    { type: 'Blocked Fire Lane', loc: 'Green Heights Condo entrance', brgy: 'Barangay 4', rep: 'HOA President', pri: 'Low' },
    { type: 'Improper Waste Burning', loc: 'Open lot at Bonifacio Ave', brgy: 'Barangay 5', rep: 'Anonymous', pri: 'Low' },
  ];
  for (const h of hazData) {
    await post('/api/services/hazards', {
      type: h.type, location: h.loc, barangay: h.brgy, reporter: h.rep, status: 'New', priority: h.pri,
    });
  }

  // ─── 23. DOCUMENTS ───
  console.log('\n── Documents ──');
  const docIds = [];
  const docData = [
    { title: 'Annual Operations Report 2024', type: 'Report', cat: 'Operations', desc: 'Summary of all operational activities for fiscal year 2024', sta: 'Approved', cid: admin.id, aid: admin.id },
    { title: 'Station Order No. 2025-001', type: 'Memorandum', cat: 'Administrative', desc: 'Reassignment of personnel effective Q2 2025', sta: 'Published', cid: admin.id, aid: admin.id },
    { title: 'Fire Safety Inspection Report - Q1', type: 'Report', cat: 'Inspection', desc: 'Consolidated inspection results for Q1 2025', sta: 'Draft', cid: sinsp.id, aid: null },
    { title: 'Inventory of Equipment 2025', type: 'Inventory', cat: 'Logistics', desc: 'Annual physical inventory of all fire station equipment', sta: 'Pending', cid: fo1.id, aid: null },
    { title: 'Training Certificate Roster', type: 'Register', cat: 'Personnel', desc: 'Master list of training certificates for all personnel', sta: 'Approved', cid: clerk.id, aid: admin.id },
    { title: 'Incident Report - BFP-2025-001', type: 'Report', cat: 'Operations', desc: 'Detailed incident report for structural fire at Rizal St', sta: 'Approved', cid: capt.id, aid: admin.id },
  ];
  for (const d of docData) {
    const doc = await post('/api/documents', {
      title: d.title, type: d.type, category: d.cat, description: d.desc,
      status: d.sta, createdById: d.cid, approvedById: d.aid,
    });
    if (doc) docIds.push(doc);
    // Add routing
    if (doc && d.sta !== 'Draft') {
      await post('/api/documents/routes', {
        documentId: doc.id, fromUserId: d.cid, toUserId: d.aid || admin.id,
        action: d.sta === 'Approved' ? 'Approve' : 'Review', remarks: 'Reviewed and approved.',
      });
    }
  }

  // ─── 24. AUDIT LOGS ───
  console.log('\n── Audit Logs ──');
  console.log('  (Audit logs are auto-generated by the application — no direct POST endpoint)');

  // ─── SUMMARY ───
  console.log('\n=======================================');
  console.log('  SEED COMPLETE');
  console.log('=======================================');
  console.log('  Base URL:', BASE);
  console.log('  Admin credentials: admin@bfp.gov.ph / admin123');
  console.log('  Created: users, personnel, shifts, attendance, leave, training,');
  console.log('  equipment, vehicles, maintenance, fuel logs, establishments,');
  console.log('  inspections, certificates, violations, hydrants, hydrant inspections,');
  console.log('  incidents, community programs, participants, volunteers,');
  console.log('  service requests, appointments, hazard reports, documents, routes');
  console.log('=======================================\n');
}

main().catch(console.error);
