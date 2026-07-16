#!/usr/bin/env node

const BASE = 'https://bfp-station-api.sanigkram24.workers.dev';

function uuid() { return crypto.randomUUID(); }
function now(d = 0) { const x = new Date(); x.setDate(x.getDate() + d); return x.toISOString(); }
function dateStr(d = 0) { const x = new Date(); x.setDate(x.getDate() + d); return x.toISOString().slice(0, 10); }

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    console.error(`  ✗ ${path}:`, data.error || res.status);
    return null;
  }
  console.log(`  ✓ ${path}`);
  return data;
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

async function main() {
  console.log('\n=== Seeding remaining data ===\n');

  // Get existing user IDs
  const users = await get('/api/users');
  const admin = users.find(u => u.email === 'admin@bfp.gov.ph');
  const sinsp = users.find(u => u.email === 'sinspector@bfp.gov.ph');
  const insp = users.find(u => u.email === 'inspector@bfp.gov.ph');
  const fo1 = users.find(u => u.email === 'fo1@bfp.gov.ph');
  const capt = users.find(u => u.email === 'captain@bfp.gov.ph');
  const clerk = users.find(u => u.email === 'clerk@bfp.gov.ph');
  if (!admin) { console.error('Admin not found!'); process.exit(1); }

  // ─── Community Programs (remaining) ───
  console.log('── Community Programs ──');
  const remainingPrograms = [
    { title: 'Earthquake Drill 2025', type: 'Drill', desc: 'Community-wide earthquake preparedness drill', loc: 'Plaza Mayor', brgy: 'Barangay 2', sched: dateStr(20), sta: 'Scheduled' },
    { title: 'Fire Prevention Month Kick-off', type: 'Campaign', desc: 'March is Fire Prevention Month - opening ceremony', loc: 'City Hall Grounds', brgy: 'Barangay 3', sched: dateStr(45), sta: 'Planned' },
    { title: 'BFP Open House', type: 'Event', desc: 'Station tour and fire truck display for kids', loc: 'BFP Station 1', brgy: 'Barangay 4', sched: dateStr(5), sta: 'Scheduled' },
    { title: 'Home Fire Safety Visit', type: 'Outreach', desc: 'Door-to-door fire safety inspection and education', loc: 'Various homes', brgy: 'Barangay 5', sched: dateStr(-10), sta: 'Completed' },
  ];
  for (const prog of remainingPrograms) {
    const p = await post('/api/community/programs', {
      title: prog.title, type: prog.type, description: prog.desc,
      location: prog.loc, barangay: prog.brgy, scheduledDate: prog.sched,
      status: prog.sta, conductedById: sinsp?.id || admin.id,
    });
    if (p) {
      for (let i = 1; i <= 5; i++) {
        await post('/api/community/participants', {
          programId: p.id, name: `Resident ${i}`, contactNumber: `091700000${i}`,
          email: `resident${i}@email.com`, attended: prog.sta === 'Completed' ? Math.random() > 0.3 : false,
        });
      }
    }
  }

  // ─── Volunteers ───
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

  // ─── Service Requests ───
  console.log('\n── Service Requests ──');
  for (const sr of [
    { type: 'Fire Safety Inspection Request', requester: 'Juan Dela Cruz', business: 'Sari-Sari Store', contact: '09181111112' },
    { type: 'FSIC Application', requester: 'Maria Clara', business: 'Clara\'s Restaurant', contact: '09182222223' },
    { type: 'Fire Clearance', requester: 'Noli Me Tangere Corp', business: 'Noli Enterprises', contact: '09183333334' },
    { type: 'Complaint - No Fire Exit', requester: 'Krislyn Santos', business: 'Sunrise Mall', contact: '09184444445' },
    { type: 'Request for Fire Truck', requester: 'Brgy Captain Reyes', business: 'Barangay 4', contact: '09185555556' },
  ]) {
    await post('/api/services/requests', {
      type: sr.type, requester: sr.requester, business: sr.business,
      contact: sr.contact, status: Math.random() > 0.5 ? 'Pending' : 'Completed',
    });
  }

  // ─── Appointments ───
  console.log('\n── Appointments ──');
  for (const a of [
    { name: 'Antonio Luna', business: 'Luna Construction', type: 'FSIC Application', date: dateStr(3), time: '09:00', address: 'Construction Site A' },
    { name: 'Apolinario Mabini', business: '', type: 'Fire Clearance', date: dateStr(3), time: '10:30', address: 'City Hall' },
    { name: 'Marcelo H. Del Pilar', business: 'Del Pilar Printing', type: 'Inspection Request', date: dateStr(4), time: '14:00', address: 'Printing Press Bldg' },
    { name: 'Emilio Jacinto', business: 'Jacinto Trading', type: 'Consultation', date: dateStr(5), time: '08:30', address: 'Trading Post' },
    { name: 'Graciano Lopez Jaena', business: '', type: 'Document Request', date: dateStr(5), time: '13:00', address: 'BFP Station 1' },
  ]) {
    await post('/api/services/appointments', {
      name: a.name, business: a.business, type: a.type, date: a.date, time: a.time, address: a.address, status: 'Scheduled',
    });
  }

  // ─── Hazard Reports ───
  console.log('\n── Hazard Reports ──');
  for (const h of [
    { type: 'Fire Hazard', loc: 'Abandoned building at Mabini St', brgy: 'Barangay 1', rep: 'Concerned Citizen', pri: 'High' },
    { type: 'Electrical Fire Risk', loc: 'Old commercial building, Rizal Ave', brgy: 'Barangay 2', rep: 'Tenant Association', pri: 'Medium' },
    { type: 'Gas Leak', loc: 'Near public market', brgy: 'Barangay 3', rep: 'Market Vendor', pri: 'Critical' },
    { type: 'Blocked Fire Lane', loc: 'Green Heights Condo entrance', brgy: 'Barangay 4', rep: 'HOA President', pri: 'Low' },
    { type: 'Improper Waste Burning', loc: 'Open lot at Bonifacio Ave', brgy: 'Barangay 5', rep: 'Anonymous', pri: 'Low' },
  ]) {
    await post('/api/services/hazards', {
      type: h.type, location: h.loc, barangay: h.brgy, reporter: h.rep, status: 'New', priority: h.pri,
    });
  }

  // ─── Documents ───
  console.log('\n── Documents ──');
  const docData = [
    { title: 'Annual Operations Report 2024', type: 'Report', cat: 'Operations', desc: 'Summary of all operational activities for fiscal year 2024', sta: 'Approved', cid: admin.id, aid: admin.id },
    { title: 'Station Order No. 2025-001', type: 'Memorandum', cat: 'Administrative', desc: 'Reassignment of personnel effective Q2 2025', sta: 'Published', cid: admin.id, aid: admin.id },
    { title: 'Fire Safety Inspection Report - Q1', type: 'Report', cat: 'Inspection', desc: 'Consolidated inspection results for Q1 2025', sta: 'Draft', cid: sinsp?.id || admin.id, aid: null },
    { title: 'Inventory of Equipment 2025', type: 'Inventory', cat: 'Logistics', desc: 'Annual physical inventory of all fire station equipment', sta: 'Pending', cid: fo1?.id || admin.id, aid: null },
    { title: 'Training Certificate Roster', type: 'Register', cat: 'Personnel', desc: 'Master list of training certificates for all personnel', sta: 'Approved', cid: clerk?.id || admin.id, aid: admin.id },
    { title: 'Incident Report - BFP-2025-001', type: 'Report', cat: 'Operations', desc: 'Detailed incident report for structural fire at Rizal St', sta: 'Approved', cid: capt?.id || admin.id, aid: admin.id },
  ];
  for (const d of docData) {
    const doc = await post('/api/documents', {
      title: d.title, type: d.type, category: d.cat, description: d.desc,
      status: d.sta, createdById: d.cid, approvedById: d.aid,
    });
    if (doc && d.sta !== 'Draft') {
      await post('/api/documents/routes', {
        documentId: doc.id, fromUserId: d.cid, toUserId: d.aid || admin.id,
        action: d.sta === 'Approved' ? 'Approve' : 'Review', remarks: 'Reviewed and approved.',
      });
    }
  }

  console.log('\n=== Continuation seed complete! ===');
  console.log(`Run "curl ${BASE}/api/reports/overview" to verify.\n`);
}

main().catch(console.error);
