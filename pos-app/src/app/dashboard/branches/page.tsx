'use client';

import { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  TrendingUp,
  Plus,
  MapPin,
  User,
  Users,
  Package,
  Edit3,
  Eye,
  MoreHorizontal,
  X,
  ChevronDown,
  Star,
  ArrowUpRight,
} from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  location: string;
  address: string;
  manager: string;
  monthlyRevenue: number;
  staffCount: number;
  topProducts: string[];
  status: 'Active' | 'Inactive';
  color: string;
  bg: string;
  growth: number;
}

const branches: Branch[] = [];

const totalRevenue = branches.reduce((s, b) => s + b.monthlyRevenue, 0);

function formatKES(n: number) {
  if (n >= 1000000) return `KES ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `KES ${(n / 1000).toFixed(0)}K`;
  return `KES ${n}`;
}

export default function BranchesPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', manager: '', phone: '', region: '' });

  return (
    <div style={{ background: '#F3F4F6', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D1117', margin: 0 }}>Branches</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>Manage all your store locations across Kenya</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '10px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)', transition: 'all 0.2s',
          }}>
          <Plus size={16} /> Add Branch
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <Building2 size={22} color="#2563EB" />
          </div>
          <div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#0D1117', margin: 0 }}>4</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Total Branches</p>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <CheckCircle2 size={22} color="#16A34A" />
          </div>
          <div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#0D1117', margin: 0 }}>4</p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Active Branches</p>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', borderRadius: '16px', padding: '22px', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <TrendingUp size={22} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>KES 1.2M</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Combined Revenue</p>
          </div>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {branches.map(branch => (
          <div key={branch.id} style={{
            background: '#fff', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden', border: '1px solid #F3F4F6', transition: 'box-shadow 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}>
            {/* Card Header */}
            <div style={{ padding: '20px 22px', borderBottom: '1px solid #F9FAFB', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: branch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={22} color={branch.color} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0D1117' }}>{branch.name}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} color="#9CA3AF" />{branch.address}
                  </p>
                </div>
              </div>
              <span style={{ background: '#F0FDF4', color: '#16A34A', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                {branch.status}
              </span>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid #F9FAFB' }}>
              <div style={{ padding: '16px 20px', borderRight: '1px solid #F9FAFB' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Monthly Revenue</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#0D1117', margin: 0 }}>{formatKES(branch.monthlyRevenue)}</p>
                <span style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                  <ArrowUpRight size={11} />+{branch.growth}%
                </span>
              </div>
              <div style={{ padding: '16px 20px', borderRight: '1px solid #F9FAFB' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Manager</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0D1117', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={13} color="#9CA3AF" />{branch.manager.split(' ')[0]}
                </p>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Staff</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#0D1117', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Users size={14} color="#9CA3AF" />{branch.staffCount}
                </p>
              </div>
            </div>

            {/* Top Products */}
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #F9FAFB' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" /> Top Products
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {branch.topProducts.map((p, i) => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '20px', height: '20px', borderRadius: '6px',
                      background: branch.bg, color: branch.color, fontSize: '11px',
                      fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '14px 22px', display: 'flex', gap: '10px' }}>
              <button style={{
                flex: 1, padding: '9px', border: '1.5px solid #E5E7EB', borderRadius: '10px',
                background: '#fff', color: '#374151', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = branch.color); (e.currentTarget.style.color = branch.color); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = '#E5E7EB'); (e.currentTarget.style.color = '#374151'); }}>
                <Edit3 size={13} /> Edit
              </button>
              <button style={{
                flex: 2, padding: '9px', border: 'none', borderRadius: '10px',
                background: branch.color, color: '#fff', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: `0 2px 8px ${branch.color}40`,
              }}>
                <Eye size={13} /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '500px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0D1117' }}>Add New Branch</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9CA3AF' }}>Set up a new store location</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={16} color="#6B7280" />
              </button>
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
              <button style={{ padding: '10px 24px', border: 'none', borderRadius: '10px', background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>Create Branch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
