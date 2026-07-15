import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, Mail } from 'lucide-react';

const STORAGE_KEY = 'bfp-users';
const SEED = [
  { id: 'USR-001', name: 'SUPT Juan Dela Cruz', email: 'juan.delacruz@bfp.gov.ph', role: 'Station Commander', rank: 'SUPT', position: 'Station Commander', contact: '0917-111-2222', isActive: true, lastLogin: 'Jul 15, 2026' },
  { id: 'USR-002', name: 'SINSP Maria Santos', email: 'maria.santos@bfp.gov.ph', role: 'Fire Officer', rank: 'SINSP', position: 'Senior Fire Officer', contact: '0917-222-3333', isActive: true, lastLogin: 'Jul 14, 2026' },
  { id: 'USR-003', name: 'FO3 Roberto Mendoza', email: 'roberto.mendoza@bfp.gov.ph', role: 'Fire Officer', rank: 'FO3', position: 'Fire Officer', contact: '0917-333-4444', isActive: true, lastLogin: 'Jul 13, 2026' },
  { id: 'USR-004', name: 'FO1 Ana Gonzales', email: 'ana.gonzales@bfp.gov.ph', role: 'Fire Officer', rank: 'FO1', position: 'Junior Fire Officer', contact: '0917-444-5555', isActive: true, lastLogin: 'Jul 12, 2026' },
  { id: 'USR-005', name: 'NCO Pedro Reyes', email: 'pedro.reyes@bfp.gov.ph', role: 'Fire Officer', rank: 'NCO', position: 'Non-Commissioned Officer', contact: '0917-555-6666', isActive: false, lastLogin: 'Jun 28, 2026' },
];

function loadItems() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return SEED;
}

function makeId() { return `USR-${Date.now().toString(36).toUpperCase().slice(-5)}`; }

const roles = ['Station Commander', 'Fire Officer', 'Public'];
const roleColors: Record<string, string> = {
  'Station Commander': 'bg-red-100 text-red-700',
  'Fire Officer': 'bg-blue-100 text-blue-700',
  'Public': 'bg-gray-100 text-gray-600',
};

const ranks = ['SUPT', 'SINSP', 'FO3', 'FO2', 'FO1', 'NCO'];

export default function UserManagement() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (!form.name || !form.email) return;
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setItems((prev) => [{ id: makeId(), ...form, isActive: true, lastLogin: 'Never' }, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' });
  }

  function edit(item: any) {
    setForm({ name: item.name, email: item.email, role: item.role, rank: item.rank || '', position: item.position || '', contact: item.contact || '' });
    setEditing(item); setShowForm(true);
  }

  function remove(id: string) { if (confirm('Deactivate this user?')) setItems((prev) => prev.filter((i) => i.id !== id)); }
  function toggleActive(id: string) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, isActive: !i.isActive } : i)); }

  const filtered = items.filter((u) => {
    if (filter === 'Active' && !u.isActive) return false;
    if (filter === 'Inactive' && u.isActive) return false;
    if (search) { const q = search.toLowerCase(); return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.rank || '').toLowerCase().includes(q); }
    return true;
  });

  const counts = {
    All: items.length,
    Active: items.filter((u) => u.isActive).length,
    Inactive: items.filter((u) => !u.isActive).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">System</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">User Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} users</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Add User
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer" onClick={() => setFilter(k)}>
            <div className="text-xs text-gray-500">{k}</div>
            <div className="text-lg font-semibold text-gray-900 mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Search users..." />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Rank / Position</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Last Login</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-semibold">
                        {u.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1"><Mail size={10} /> {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {u.rank ? <><span className="font-medium">{u.rank}</span> — {u.position}</> : u.position || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.contact || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(u.id)}
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.lastLogin}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => edit(u)} className="p-1.5 text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                      <button onClick={() => remove(u.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center text-sm text-gray-400 py-8">No users found.</div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit User' : 'New User'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rank</label>
                  <select value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">— Select —</option>
                    {ranks.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                  <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact Number</label>
                  <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.name || !form.email}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
