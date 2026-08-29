'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  TrendingUp,
  Plus,
  MapPin,
  User,
  Users,
  Eye,
  X,
  Trash2,
} from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  location: string;
  address: string;
  manager: string;
  monthlyRevenue: number;
  staffCount: number;
  status: 'Active' | 'Inactive';
  color: string;
  bg: string;
  phone?: string;
}

const BRANCH_COLORS = [
  { color: '#2563EB', bg: '#EFF6FF' },
  { color: '#7C3AED', bg: '#F5F3FF' },
  { color: '#16A34A', bg: '#F0FDF4' },
  { color: '#D97706', bg: '#FFFBEB' },
  { color: '#DC2626', bg: '#FEF2F2' },
  { color: '#0891B2', bg: '#ECFEFF' },
];

function formatKES(n: number) {
  if (n >= 1000000) return `KES ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `KES ${(n / 1000).toFixed(0)}K`;
  return `KES ${n}`;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', manager: '', phone: '', region: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('haxone_branches') || '[]');
        setBranches(stored);
      } catch (e) {}
    }
  }, []);

  const handleAddBranch = () => {
    if (!form.name || !form.address) return;
    const colorIdx = branches.length % BRANCH_COLORS.length;
    const newBranch: Branch = {
      id: Date.now(),
      name: form.name,
      location: form.city || 'Kenya',
      address: form.address,
      manager: form.manager || 'Unassigned',
      monthlyRevenue: 0,
      staffCount: 0,
      status: 'Active',
      color: BRANCH_COLORS[colorIdx].color,
      bg: BRANCH_COLORS[colorIdx].bg,
      phone: form.phone,
    };
    const updated = [newBranch, ...branches];
    setBranches(updated);
    localStorage.setItem('haxone_branches', JSON.stringify(updated));
    setForm({ name: '', address: '', city: '', manager: '', phone: '', region: '' });
    setShowModal(false);
  };

  const handleDeleteBranch = (id: number) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      const updated = branches.filter(b => b.id !== id);
      setBranches(updated);
      localStorage.setItem('haxone_branches', JSON.stringify(updated));
    }
  };

  const totalRevenue = branches.reduce((s, b) => s + b.monthlyRevenue, 0);
  const activeBranches = branches.filter(b => b.status === 'Active').length;

  return (
    <div style={{ background: '#F3F4F6', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D1117', margin: 0 }}>Branches</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>Manage all your store locations across Kenya</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
          <Plus size={16} /> Add Branch
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '12px', display: 'flex' }}><Building2 size={22} color="#2563EB" /></div>
          <div><p style={{ fontSize: '28px', fontWeight: 700, color: '#0D1117', margin: 0 }}>{branches.length}</p><p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Total Branches</p></div>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '12px', padding: '12px', display: 'flex' }}><CheckCircle2 size={22} color="#16A34A" /></div>
          <div><p style={{ fontSize: '28px', fontWeight: 700, color: '#0D1117', margin: 0 }}>{activeBranches}</p><p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Active Branches</p></div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', borderRadius: '16px', padding: '22px', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', display: 'flex' }}><TrendingUp size={22} color="#fff" /></div>
          <div><p style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>{formatKES(totalRevenue)}</p><p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Combined Revenue</p></div>
        </div>
      </div>

      {branches.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <Building2 size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7280', fontSize: '16px', fontWeight: 600 }}>No branches yet</p>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Click &ldquo;Add Branch&rdquo; to set up your first store location.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {branches.map(branch => (
            <div key={branch.id} style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
              <div style={{ padding: '20px 22px', borderBottom: '1px solid #F9FAFB', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: branch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Building2 size={22} color={branch.color} /></div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0D1117' }}>{branch.name}</h3>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} color="#9CA3AF" />{branch.address}</p>
                  </div>
                </div>
                <span style={{ background: '#F0FDF4', color: '#16A34A', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{branch.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid #F9FAFB' }}>
                <div style={{ padding: '16px 20px', borderRight: '1px solid #F9FAFB' }}>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Revenue</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#0D1117', margin: 0 }}>{formatKES(branch.monthlyRevenue)}</p>
                </div>
                <div style={{ padding: '16px 20px', borderRight: '1px solid #F9FAFB' }}>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Manager</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0D1117', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}><User size={13} color="#9CA3AF" />{branch.manager.split(' ')[0]}</p>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Staff</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#0D1117', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={14} color="#9CA3AF" />{branch.staffCount}</p>
                </div>
              </div>
              <div style={{ padding: '14px 22px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleDeleteBranch(branch.id)} style={{ flex: 1, padding: '9px', border: '1.5px solid #FCA5A5', borderRadius: '10px', background: '#FEF2F2', color: '#DC2626', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={13} /> Delete</button>
                <button style={{ flex: 2, padding: '9px', border: 'none', borderRadius: '10px', background: branch.color, color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: `0 2px 8px ${branch.color}40` }}><Eye size={13} /> View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0D1117' }}>Add New Branch</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9CA3AF' }}>Set up a new store location</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex' }}><X size={16} color="#6B7280" /></button>
            </div>
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Branch Name', key: 'name', placeholder: 'e.g. Karen', span: 2 },
                { label: 'Street Address', key: 'address', placeholder: 'e.g. Ngong Road, Karen', span: 2 },
                { label: 'City', key: 'city', placeholder: 'e.g. Nairobi', span: 1 },
                { label: 'Region', key: 'region', placeholder: 'e.g. Nairobi County', span: 1 },
                { label: 'Manager Name', key: 'manager', placeholder: 'e.g. Jane Wanjiku', span: 1 },
                { label: 'Contact Phone', key: 'phone', placeholder: '+254 7XX XXX XXX', span: 1 },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.span === 2 ? 'span 2' : 'span 1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ padding: '20px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '1.5px solid #E5E7EB', borderRadius: '10px', background: '#fff', color: '#374151', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAddBranch} style={{ padding: '10px 24px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>Create Branch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
