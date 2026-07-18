'use client';

import { useState } from 'react';
import {
  Users,
  UserCheck,
  Coffee,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  X,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: 'Manager' | 'Cashier' | 'Stock Clerk';
  phone: string;
  email: string;
  branch: string;
  shift: string;
  salesToday: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  username: string;
  initials: string;
  color: string;
}

const employees: Employee[] = [];

const roleBadge: Record<string, { bg: string; text: string }> = {
  Manager: { bg: '#EFF6FF', text: '#2563EB' },
  Cashier: { bg: '#F0FDF4', text: '#16A34A' },
  'Stock Clerk': { bg: '#F5F3FF', text: '#7C3AED' },
};

const statusBadge: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#F0FDF4', text: '#16A34A' },
  'On Leave': { bg: '#FFFBEB', text: '#D97706' },
  Inactive: { bg: '#FEF2F2', text: '#DC2626' },
};

const statCards = [
  { label: 'Total Staff', value: 14, icon: Users, color: '#2563EB', bg: '#EFF6FF' },
  { label: 'Active', value: 12, icon: UserCheck, color: '#16A34A', bg: '#F0FDF4' },
  { label: 'On Leave', value: 2, icon: Coffee, color: '#D97706', bg: '#FFFBEB' },
  { label: 'Cashiers', value: 5, icon: ShoppingCart, color: '#7C3AED', bg: '#F5F3FF' },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '', role: 'Cashier', phone: '', email: '', branch: 'Nairobi CBD', username: '', password: '',
  });
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase()) ||
    e.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#F3F4F6', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D1117', margin: 0 }}>Employees</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>Manage your team across all branches</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '10px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            transition: 'all 0.2s',
          }}
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {statCards.map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: '16px', padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{ background: card.bg, borderRadius: '12px', padding: '12px', display: 'flex' }}>
              <card.icon size={22} color={card.color} />
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: 700, color: '#0D1117', margin: 0 }}>{card.value}</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* Table Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              style={{
                width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px',
                padding: '9px 12px 9px 38px', fontSize: '14px', color: '#0D1117',
                outline: 'none', background: '#FAFAFA', boxSizing: 'border-box',
              }}
            />
          </div>
          <button style={{
            border: '1.5px solid #E5E7EB', background: '#fff', borderRadius: '10px',
            padding: '9px 16px', fontSize: '14px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: '6px', color: '#374151', fontWeight: 500,
          }}>
            <Filter size={15} /> Filter
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Employee', 'Role', 'Contact', 'Branch', 'Shift', 'Sales Today', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, idx) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%', background: emp.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0,
                      }}>{emp.initials}</div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#0D1117', margin: 0 }}>{emp.name}</p>
                        <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>@{emp.username}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: roleBadge[emp.role].bg, color: roleBadge[emp.role].text,
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    }}>{emp.role}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ color: '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={12} color="#9CA3AF" />{emp.phone}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={12} color="#9CA3AF" />{emp.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#374151' }}>
                      <MapPin size={13} color="#9CA3AF" />{emp.branch}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151' }}>{emp.shift}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0D1117' }}>
                    {emp.salesToday > 0 ? `KES ${emp.salesToday.toLocaleString()}` : <span style={{ color: '#D1D5DB' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: statusBadge[emp.status].bg, color: statusBadge[emp.status].text,
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    }}>{emp.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setActiveMenu(activeMenu === emp.id ? null : emp.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                      >
                        <MoreVertical size={16} color="#9CA3AF" />
                      </button>
                      {activeMenu === emp.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '28px', zIndex: 100,
                          background: '#fff', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          border: '1px solid #F3F4F6', minWidth: '140px', overflow: 'hidden',
                        }}>
                          <button onClick={() => setActiveMenu(null)} style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
                            <Edit2 size={13} /> Edit Employee
                          </button>
                          <button onClick={() => setActiveMenu(null)} style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626' }}>
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '14px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>Showing {filtered.length} of {employees.length} employees</p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2].map(n => (
              <button key={n} style={{ width: '32px', height: '32px', borderRadius: '8px', border: n === 1 ? 'none' : '1px solid #E5E7EB', background: n === 1 ? '#2563EB' : '#fff', color: n === 1 ? '#fff' : '#374151', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0D1117' }}>Add New Employee</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9CA3AF' }}>Fill in the details below</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={16} color="#6B7280" />
              </button>
            </div>
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Jane Wanjiru', span: 2 },
                { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+254 7XX XXX XXX', span: 1 },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'jane@haxone.co.ke', span: 1 },
                { label: 'Username', key: 'username', type: 'text', placeholder: 'e.g. jwanjiru', span: 1 },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.span === 2 ? 'span 2' : 'span 1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' }}
                  />
                </div>
              ))}
              {/* Role */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Role</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 36px 10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', appearance: 'none', cursor: 'pointer' }}>
                    <option>Manager</option>
                    <option>Cashier</option>
                    <option>Stock Clerk</option>
                  </select>
                  <ChevronDown size={15} color="#9CA3AF" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
              {/* Branch */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Branch</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 36px 10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', appearance: 'none', cursor: 'pointer' }}>
                    <option>Nairobi CBD</option>
                    <option>Westlands</option>
                    <option>Mombasa Road</option>
                    <option>Kisumu</option>
                  </select>
                  <ChevronDown size={15} color="#9CA3AF" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
              {/* Password */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 40px 10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }}
                  />
                  <button onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    {showPassword ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
                  </button>
                </div>
              </div>
            </div>
            <div style={{ padding: '20px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '1.5px solid #E5E7EB', borderRadius: '10px', background: '#fff', color: '#374151', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button style={{ padding: '10px 24px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
