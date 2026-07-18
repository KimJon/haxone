'use client';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, X } from 'lucide-react';

const CATEGORY_META: Record<string, { color: string; bg: string; pieColor: string }> = {
  Rent:        { color: 'text-blue-700',    bg: 'bg-blue-50',    pieColor: '#2563EB' },
  Utilities:   { color: 'text-yellow-700',  bg: 'bg-yellow-50',  pieColor: '#F59E0B' },
  Salaries:    { color: 'text-violet-700',  bg: 'bg-violet-50',  pieColor: '#7C3AED' },
  Supplies:    { color: 'text-emerald-700', bg: 'bg-emerald-50', pieColor: '#10B981' },
  Transport:   { color: 'text-cyan-700',    bg: 'bg-cyan-50',    pieColor: '#06B6D4' },
  Marketing:   { color: 'text-pink-700',    bg: 'bg-pink-50',    pieColor: '#EC4899' },
  Maintenance: { color: 'text-orange-700',  bg: 'bg-orange-50',  pieColor: '#F97316' },
};

const BASE_CATEGORIES = ['Rent','Utilities','Salaries','Supplies','Transport','Marketing','Maintenance'];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(BASE_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Rent',
    description: '',
    amount: '',
    paidVia: 'Cash'
  });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('haxone_expenses') || '[]');
      setExpenses(stored);
      const custom = JSON.parse(localStorage.getItem('haxone_expense_categories') || '[]');
      if (custom.length > 0) setCategories(prev => Array.from(new Set([...prev, ...custom])));
    } catch(e) {}
  }, []);

  const handleSave = () => {
    if (!form.description || !form.amount) return;
    // Auto-add new category if typed
    if (form.category.trim() && !categories.includes(form.category.trim())) {
      const newCats = [...categories, form.category.trim()];
      setCategories(newCats);
      localStorage.setItem('haxone_expense_categories', JSON.stringify(newCats.filter(c => !BASE_CATEGORIES.includes(c))));
    }
    const newExpense = {
      id: `EXP-${Math.random().toString(36).substr(2,5).toUpperCase()}`,
      date: form.date || new Date().toISOString().split('T')[0],
      category: form.category.trim(),
      description: form.description,
      amount: parseFloat(form.amount),
      paidVia: form.paidVia,
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem('haxone_expenses', JSON.stringify(updated));
    setForm({ date: new Date().toISOString().split('T')[0], category: 'Rent', description: '', amount: '', paidVia: 'Cash' });
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('haxone_expenses', JSON.stringify(updated));
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonth = expenses
    .filter(e => e.date?.startsWith(new Date().toISOString().substring(0,7)))
    .reduce((s,e)=>s+e.amount,0);

  const byCategory = Object.entries(
    expenses.reduce((acc: Record<string, number>, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value: value as number }));

  const getMeta = (cat: string) =>
    CATEGORY_META[cat] || { color: 'text-gray-700', bg: 'bg-gray-100', pieColor: '#6B7280' };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Expenses</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage your business expenses</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors">
          <Plus size={16} /> Record Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Expenses',  value: `KES ${total.toLocaleString()}`,       color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { label: 'This Month',      value: `KES ${thisMonth.toLocaleString()}`,    color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Utilities',       value: `KES ${expenses.filter(e=>e.category==='Utilities').reduce((s,e)=>s+e.amount,0).toLocaleString()}`, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Supplies',        value: `KES ${expenses.filter(e=>e.category==='Supplies').reduce((s,e)=>s+e.amount,0).toLocaleString()}`,  color: 'text-emerald-600',bg: 'bg-emerald-50'},
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-2xl font-bold text-[#0D1117]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            <div className={`h-1 rounded-full mt-3 ${s.bg}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-[#0D1117]">Expense Records</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {['Date','Category','Description','Amount','Paid Via','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">No expenses recorded yet. Click &ldquo;Record Expense&rdquo; to add one.</td></tr>
                ) : expenses.map(e => {
                  const meta = getMeta(e.category);
                  return (
                    <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{e.date}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${meta.bg} ${meta.color}`}>{e.category}</span>
                      </td>
                      <td className="px-4 py-3.5 text-[#0D1117]">{e.description}</td>
                      <td className="px-4 py-3.5 font-bold text-[#0D1117]">KES {e.amount.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-gray-500">{e.paidVia}</td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => handleDelete(e.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-[#0D1117] mb-4">By Category</h2>
          {byCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          ) : (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                      {byCategory.map((entry) => <Cell key={entry.name} fill={getMeta(entry.name).pieColor} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`KES ${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {byCategory.sort((a,b) => b.value - a.value).map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getMeta(item.name).pieColor }}></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#0D1117]">KES {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#0D1117]">Record Expense</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Category <span className="text-gray-400 font-normal">(type to add a new one)</span>
                </label>
                <input
                  list="expense-categories"
                  value={form.category}
                  onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  placeholder="e.g. Rent, Utilities, Parking..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]"
                />
                <datalist id="expense-categories">
                  {categories.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="What was this expense for?" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Amount (KES)</label>
                  <input type="number" value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} placeholder="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Paid Via</label>
                  <select value={form.paidVia} onChange={e => setForm(f => ({...f, paidVia: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] bg-white">
                    {['Cash','M-Pesa','Card','Bank Transfer'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Save Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
