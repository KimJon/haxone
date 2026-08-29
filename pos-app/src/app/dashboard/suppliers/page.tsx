'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Search,
  Truck,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Eye,
  ChevronDown,
} from 'lucide-react';

interface Supplier {
  id: number;
  company: string;
  name?: string; // Legacy support
  contact: string;
  phone: string;
  email: string;
  location: string;
  products: number;
  orders: number;
  balance: number;
  status: 'Active' | 'Inactive';
  category: string;
}

const INITIAL_SUPPLIERS: Supplier[] = [];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [form, setForm] = useState({
    company: '', contact: '', phone: '', email: '', location: '', category: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSuppliers = JSON.parse(localStorage.getItem('haxone_suppliers') || '[]');
        setSuppliers(storedSuppliers);
      } catch (e) {}
    }
  }, []);

  const filtered = suppliers.filter(s => {
    const compName = s.company || s.name || '';
    const contactName = s.contact || '';
    const catName = s.category || '';
    
    const matchSearch = compName.toLowerCase().includes(search.toLowerCase()) ||
      contactName.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalBalance = suppliers.reduce((sum, s) => sum + (s.balance || 0), 0);

  const stats = [
    {
      label: 'Total Suppliers', value: suppliers.length, icon: <Truck size={20} />, color: 'text-blue-600', bg: 'bg-blue-50',
      sub: `${suppliers.length} registered`,
    },
    {
      label: 'Active', value: suppliers.filter(s => s.status === 'Active').length, icon: <CheckCircle size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50',
      sub: 'Currently supplying',
    },
    {
      label: 'Outstanding Balance', value: `KES ${(totalBalance / 1000).toFixed(0)}K`, icon: <DollarSign size={20} />, color: 'text-amber-600', bg: 'bg-amber-50',
      sub: `Across ${suppliers.filter(s => s.balance > 0).length} suppliers`,
    },
  ];

  function openAdd() {
    setEditSupplier(null);
    setForm({ company: '', contact: '', phone: '', email: '', location: '', category: '' });
    setShowModal(true);
  }

  function openEdit(s: Supplier) {
    setEditSupplier(s);
    setForm({ company: s.company, contact: s.contact, phone: s.phone, email: s.email, location: s.location, category: s.category });
    setShowModal(true);
  }

  function handleSave() {
    let updated;
    if (editSupplier) {
      updated = suppliers.map(s => s.id === editSupplier.id ? { ...s, ...form } : s);
    } else {
      updated = [{
        id: Date.now(), ...form, products: 0, orders: 0, balance: 0, status: 'Active' as const,
      }, ...suppliers];
    }
    setSuppliers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('haxone_suppliers', JSON.stringify(updated));
    }
    setShowModal(false);
  }

  function toggleStatus(id: number) {
    const updated = suppliers.map(s => s.id === id ? { ...s, status: (s.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' } : s);
    setSuppliers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('haxone_suppliers', JSON.stringify(updated));
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your supply chain partners</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-[#0D1117] mt-0.5">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by company, contact, or category…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition"
          />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] appearance-none bg-white">
            {['All Status', 'Active', 'Inactive'].map(v => <option key={v}>{v}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Products</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Orders</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Balance (KES)</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Truck size={16} className="text-[#2563EB]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0D1117]">{s.company || s.name}</p>
                        <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><MapPin size={10} />{s.location || 'Unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#0D1117]">{s.contact}</p>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={10} />{s.phone}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Mail size={10} />{s.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{s.category}</span>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-[#0D1117]">{s.products}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{s.orders}</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`font-bold ${s.balance > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {s.balance > 0 ? s.balance.toLocaleString() : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => toggleStatus(s.id)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {s.status === 'Active' ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                      {s.status}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">No suppliers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {filtered.length} of {suppliers.length} suppliers
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#0D1117]">{editSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Company Name *</label>
                <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Bidco Africa Ltd" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Contact Person *</label>
                  <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone *</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 2X XXX XXXX" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="procurement@company.co.ke" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Nairobi, Kenya" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Category</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Cooking Oil & Fats" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={!form.company || !form.contact || !form.phone} className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors">
                {editSupplier ? 'Save Changes' : 'Add Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
