'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Search,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Eye,
  Phone,
  Mail,
  ChevronDown,
} from 'lucide-react';

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
  'bg-teal-500', 'bg-orange-500', 'bg-lime-600', 'bg-sky-500',
];

const INITIAL_CUSTOMERS: any[] = [];

const TIER_STYLES: Record<string, string> = {
  Platinum: 'bg-purple-50 text-purple-700',
  Gold: 'bg-amber-50 text-amber-700',
  Silver: 'bg-gray-100 text-gray-600',
  Bronze: 'bg-orange-50 text-orange-700',
};

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  orders: number;
  spent: number;
  lastVisit: string;
  points: number;
  tier: string;
}

function Initials({ name, index }: { name: string; index: number }) {
  const parts = name.split(' ');
  const initials = parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].substring(0, 2);
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
      {initials.toUpperCase()}
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [tierFilter, setTierFilter] = useState('All Tiers');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedCustomers = JSON.parse(localStorage.getItem('haxone_customers') || '[]');
        setCustomers(storedCustomers);
      } catch (e) {}
    }
  }, []);

  const handleSaveCustomer = () => {
    if (!form.name || !form.phone) return;

    const newCustomer = {
      id: Math.floor(Math.random() * 1000000),
      name: form.name,
      phone: form.phone,
      email: form.email || 'N/A',
      orders: 0,
      spent: 0,
      lastVisit: 'Never',
      points: 0,
      tier: 'Bronze',
      notes: form.notes
    };

    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('haxone_customers', JSON.stringify(updated));
    }
    setShowModal(false);
    setForm({ name: '', phone: '', email: '', notes: '' });
  };

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'All Tiers' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const totalRevenue = customers.reduce((s, c) => s + c.spent, 0);
  const avgSpend = customers.length ? Math.round(totalRevenue / customers.length) : 0;

  const stats = [
    { label: 'Total Customers', value: '1,284', icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', sub: '+12 this week' },
    { label: 'Active This Month', value: '432', icon: <TrendingUp size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: '33.6% of total' },
    { label: 'Avg Spend', value: `KES ${avgSpend.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'text-violet-600', bg: 'bg-violet-50', sub: 'Per customer' },
    { label: 'Total Revenue', value: 'KES 2.3M', icon: <Star size={20} />, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'All time' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${s.bg} ${s.color} p-2.5 rounded-lg`}>{s.icon}</div>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
            <p className="text-xl font-bold text-[#0D1117]">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
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
            placeholder="Search by name, phone, or email…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition"
          />
        </div>
        <div className="relative">
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] appearance-none bg-white">
            {['All Tiers', 'Platinum', 'Gold', 'Silver', 'Bronze'].map(t => <option key={t}>{t}</option>)}
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
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Contact</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Orders</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Total Spent</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Last Visit</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Points</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Tier</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <Initials name={c.name} index={i} />
                    <span className="font-medium text-[#0D1117] whitespace-nowrap">{c.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-gray-600 text-xs"><Phone size={11} />{c.phone}</span>
                      <span className="flex items-center gap-1.5 text-gray-400 text-xs"><Mail size={11} />{c.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-[#0D1117]">{c.orders}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-[#0D1117]">KES {c.spent.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{c.lastVisit}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="flex items-center justify-end gap-1 text-amber-600 font-semibold text-xs">
                      <Star size={11} fill="currentColor" />{c.points.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${TIER_STYLES[c.tier]}`}>{c.tier}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-500 text-xs font-medium rounded-lg transition-colors">
                      <Eye size={12} />View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {filtered.length} of {customers.length} customers
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#0D1117]">Add New Customer</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Wanjiku Kamau" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number *</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 7XX XXX XXX" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="customer@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Optional notes about this customer…" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] resize-none" />
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700 font-medium">💡 Loyalty Program</p>
                <p className="text-xs text-blue-600 mt-0.5">Customer will earn 1 point per KES 100 spent. Starts at Bronze tier.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveCustomer} disabled={!form.name || !form.phone} className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors">
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
