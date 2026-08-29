'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingBag, ArrowUp, Download, Eye } from 'lucide-react';

const PAYMENT_COLORS: Record<string, string> = {
  'M-Pesa': 'bg-green-50 text-green-700',
  Cash: 'bg-gray-100 text-gray-600',
  Card: 'bg-blue-50 text-blue-700',
  PayPal: 'bg-indigo-50 text-indigo-700',
};

const CHART_DATA: any[] = [];

const STATUS_STYLES: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700',
  Refunded: 'bg-amber-50 text-amber-700',
  Cancelled: 'bg-red-50 text-red-600',
};

const TABS = ['Today', 'This Week', 'This Month', 'This Year'];

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState('Today');
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('haxone_sales') || '[]');
      setTransactions(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getFilteredTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().substring(0, 7);
    const thisYear = new Date().getFullYear().toString();
    
    return transactions.filter(t => {
      // t.fullDate is ISO string from pos
      const tDate = t.fullDate ? t.fullDate.split('T')[0] : '';
      if (activeTab === 'Today') return tDate === today;
      if (activeTab === 'This Week') {
        const d = new Date(t.fullDate || new Date());
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (activeTab === 'This Month') return tDate.startsWith(thisMonth);
      if (activeTab === 'This Year') return tDate.startsWith(thisYear);
      return true;
    });
  };

  const filtered = getFilteredTransactions();

    const getChartData = () => {
      const data = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];
        
        const daySales = transactions
          .filter(t => t.fullDate && t.fullDate.startsWith(dayStr) && t.status === 'Completed')
          .reduce((sum, t) => sum + t.amount, 0);
          
        data.push({
          day: d.toLocaleDateString('en-US', { weekday: 'short' }),
          sales: daySales
        });
      }
      return data;
    };

    const dynamicChartData = getChartData();
    const totalRevenue = filtered.filter(t => t.status === 'Completed').reduce((s, t) => s + t.amount, 0);
    const avgOrder = filtered.length ? Math.round(totalRevenue / filtered.length) : 0;
    const totalOrders = filtered.length;
    const returnsCount = filtered.filter(t => t.status === 'Refunded').length;

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Sales</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track your revenue and transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 p-1 rounded-xl w-fit mb-6 shadow-sm">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Calculated from sales', subColor: 'text-green-600' },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), icon: <ShoppingBag size={20} />, color: 'text-violet-600', bg: 'bg-violet-50', sub: 'Successful orders', subColor: 'text-green-600' },
          { label: 'Avg Order Value', value: `KES ${avgOrder.toLocaleString()}`, icon: <ArrowUp size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Per transaction', subColor: 'text-gray-400' },
          { label: 'Returns/Refunds', value: returnsCount, icon: <ArrowUp size={20} className="rotate-180" />, color: 'text-red-600', bg: 'bg-red-50', sub: 'Refunded items', subColor: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
            <div className={`${s.bg} ${s.color} p-2.5 rounded-lg w-fit mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-[#0D1117]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            <div className={`text-xs mt-1 font-medium ${s.subColor}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-[#0D1117] mb-6">Revenue — Last 7 Days</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dynamicChartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={v => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v: any) => [`KES ${Number(v).toLocaleString()}`, 'Sales']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="sales" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#0D1117]">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {['Receipt #', 'Date & Time', 'Customer', 'Items', 'Payment', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No sales recorded for this period.
                </td>
              </tr>
            ) : (
              filtered.map(t => {
                const totalItems = t.items ? t.items.reduce((acc: number, item: any) => acc + item.qty, 0) : 0;
                return (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-[#0D1117] font-medium">{t.id}</td>
                    <td className="px-4 py-3.5 text-gray-500">{t.date}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-[#0D1117]">{t.customer || 'Walk-in Customer'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 font-medium">{totalItems} items</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${PAYMENT_COLORS[t.method] || 'bg-gray-100 text-gray-700'}`}>
                        {t.method}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-[#0D1117]">KES {t.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[t.status] || 'bg-green-50 text-green-700'}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">Showing {filtered.length} transactions</div>
      </div>
    </div>
  );
}
