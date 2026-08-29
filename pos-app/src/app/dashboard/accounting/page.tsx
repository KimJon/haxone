'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Download,
  CalendarDays,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
type Period = 'this_month' | 'last_month' | 'this_quarter' | 'ytd';

interface PLRow {
  label: string;
  thisMonth: number | null;
  lastMonth: number | null;
  isHeader?: boolean;
  isTotal?: boolean;
  isIndent?: boolean;
  isNegative?: boolean;
  isNet?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `KES ${Math.abs(n).toLocaleString('en-KE')}`;
const fmtShort = (n: number) => `KES ${(n / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold text-[#0D1117] mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill }} />
            <span className="text-gray-500">{p.name}:</span>
            <span className="font-semibold">{fmt(p.value)}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-xs">
          <span className="text-gray-400">Net Cash</span>
          <span className={`font-bold ${(payload[0]?.value || 0) - (payload[1]?.value || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {fmt((payload[0]?.value || 0) - (payload[1]?.value || 0))}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  iconBg: string;
}
function KPICard({ icon, label, value, change, positive, iconBg }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold px-2.5 py-1 rounded-full ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {change}
        </span>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-[#0D1117] mt-0.5">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">Calculated locally</p>
      </div>
    </div>
  );
}

// ─── P&L Row ──────────────────────────────────────────────────────────────────
function PLRow({ row }: { row: PLRow }) {
  if (row.isHeader) {
    return (
      <tr>
        <td colSpan={4} className="px-6 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/80">
          {row.label}
        </td>
      </tr>
    );
  }

  const delta =
    row.thisMonth !== null && row.lastMonth !== null
      ? row.thisMonth - row.lastMonth
      : null;

  const getColor = (val: number, neg?: boolean, net?: boolean) => {
    if (net) return val >= 0 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold';
    if (neg || val < 0) return 'text-red-600';
    return 'text-[#0D1117]';
  };

  return (
    <tr className={`${row.isTotal ? 'bg-gray-50 border-t border-gray-200' : 'hover:bg-gray-50/40'} transition-colors`}>
      <td className={`px-6 py-3 text-sm ${row.isTotal ? 'font-bold text-[#0D1117]' : row.isIndent ? 'text-gray-600' : 'font-medium text-[#0D1117]'} ${row.isIndent ? 'pl-10' : ''}`}>
        {row.label}
      </td>
      <td className={`px-6 py-3 text-sm text-right font-medium ${row.thisMonth !== null ? getColor(row.thisMonth, row.isNegative, row.isNet) : ''}`}>
        {row.thisMonth !== null
          ? `${row.thisMonth < 0 || row.isNegative ? '(' : ''}${fmt(row.thisMonth)}${row.thisMonth < 0 || row.isNegative ? ')' : ''}`
          : '—'}
      </td>
      <td className={`px-6 py-3 text-sm text-right font-medium ${row.lastMonth !== null ? getColor(row.lastMonth, row.isNegative, row.isNet) : ''}`}>
        {row.lastMonth !== null
          ? `${row.lastMonth < 0 || row.isNegative ? '(' : ''}${fmt(row.lastMonth)}${row.lastMonth < 0 || row.isNegative ? ')' : ''}`
          : '—'}
      </td>
      <td className="px-6 py-3 text-sm text-right">
        {delta !== null ? (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${delta >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {delta >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {fmt(Math.abs(delta))}
          </span>
        ) : '—'}
      </td>
    </tr>
  );
}

// ─── VAT Card ─────────────────────────────────────────────────────────────────
interface VATItemProps { label: string; value: string; sub?: string; highlight?: boolean }
function VATItem({ label, value, sub, highlight }: VATItemProps) {
  return (
    <div className={`flex flex-col gap-1 p-4 rounded-xl ${highlight ? 'bg-[#2563EB] text-white' : 'bg-gray-50'}`}>
      <span className={`text-xs font-medium uppercase tracking-wide ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-xl font-bold ${highlight ? 'text-white' : 'text-[#0D1117]'}`}>{value}</span>
      {sub && <span className={`text-xs ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>{sub}</span>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AccountingPage() {
  const [period, setPeriod] = useState<Period>('this_month');
  const [sales, setSales] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setSales(JSON.parse(localStorage.getItem('haxone_sales') || '[]'));
        setExpenses(JSON.parse(localStorage.getItem('haxone_expenses') || '[]'));
      } catch (e) {}
    }
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + (Number(s.amount) || Number(s.total) || 0), 0);
  
  const cogs = sales.reduce((sum, s) => {
    if (!s.items) return sum;
    return sum + s.items.reduce((acc: number, item: any) => acc + ((Number(item.costPrice) || Number(item.buyPrice) || 0) * (Number(item.quantity) || Number(item.qty) || 1)), 0);
  }, 0);

  const grossProfit = totalRevenue - cogs;
  
  // Aggregate expenses by category
  const expensesByCategory = expenses.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const totalExpenses = Object.values(expensesByCategory).reduce((s, a) => s + a, 0);
  const netProfit = grossProfit - totalExpenses;

  // Build dynamic cashFlowData for the last 6 months
  const cashFlowMap: Record<string, { month: string; inflows: number; outflows: number }> = {};
  
  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStr = d.toLocaleString('default', { month: 'short' });
    const yearStr = d.getFullYear().toString().slice(-2);
    const key = `${monthStr} '${yearStr}`;
    cashFlowMap[key] = { month: key, inflows: 0, outflows: 0 };
  }

  sales.forEach(s => {
    if (!s.date) return;
    const d = new Date(s.date);
    const key = `${d.toLocaleString('default', { month: 'short' })} '${d.getFullYear().toString().slice(-2)}`;
    if (cashFlowMap[key]) {
      cashFlowMap[key].inflows += (s.amount || 0);
    }
  });

  expenses.forEach(e => {
    if (!e.date) return;
    const d = new Date(e.date);
    const key = `${d.toLocaleString('default', { month: 'short' })} '${d.getFullYear().toString().slice(-2)}`;
    if (cashFlowMap[key]) {
      cashFlowMap[key].outflows += (e.amount || 0);
    }
  });

  const cashFlowData = Object.values(cashFlowMap);

  // Build PLRows dynamically
  const plRows: PLRow[] = [
    { label: 'Revenue',                thisMonth: totalRevenue, lastMonth: 0 },
    { label: 'Cost of Goods Sold',     thisMonth: cogs, lastMonth: 0, isNegative: true },
    { label: 'Gross Profit',           thisMonth: grossProfit, lastMonth: 0, isTotal: true },
    { label: 'Operating Expenses',     thisMonth: null,   lastMonth: null,   isHeader: true },
    ...Object.entries(expensesByCategory).map(([cat, amt]) => ({
      label: cat, thisMonth: amt as number, lastMonth: 0, isIndent: true, isNegative: true
    })),
    { label: 'Total Operating Expenses', thisMonth: totalExpenses, lastMonth: 0, isTotal: true, isNegative: true },
    { label: 'Net Profit',             thisMonth: netProfit,   lastMonth: 0,  isTotal: true, isNet: true },
  ];

  const periods: { key: Period; label: string }[] = [
    { key: 'this_month',   label: 'This Month' },
    { key: 'last_month',   label: 'Last Month' },
    { key: 'this_quarter', label: 'This Quarter' },
    { key: 'ytd',          label: 'Year to Date' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Accounting</h1>
          <p className="text-sm text-gray-500 mt-0.5">Financial performance, P&L, cash flow, and VAT</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<TrendingUp size={19} className="text-blue-600" />}
          iconBg="bg-blue-50"
          label="Total Revenue"
          value={fmt(totalRevenue)}
          change="Real-time"
          positive={true}
        />
        <KPICard
          icon={<ShoppingBag size={19} className="text-amber-600" />}
          iconBg="bg-amber-50"
          label="Cost of Goods Sold"
          value={fmt(cogs)}
          change="Real-time"
          positive={false}
        />
        <KPICard
          icon={<DollarSign size={19} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          label="Gross Profit"
          value={fmt(grossProfit)}
          change="Real-time"
          positive={true}
        />
        <KPICard
          icon={<TrendingDown size={19} className="text-violet-600" />}
          iconBg="bg-violet-50"
          label="Net Profit"
          value={fmt(netProfit)}
          change="Real-time"
          positive={netProfit >= 0}
        />
      </div>

      {/* ── P&L Table ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-[#2563EB]" />
            <div>
              <h2 className="text-base font-semibold text-[#0D1117]">Profit & Loss Statement</h2>
              <p className="text-xs text-gray-400">This Month vs Last Month — KES</p>
            </div>
          </div>
          <button className="text-xs text-[#2563EB] hover:underline font-medium flex items-center gap-1">
            <Download size={12} /> Export P&L
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Line Item</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">This Month</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Month</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plRows.map((row, i) => (
                <PLRow key={i} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Cash Flow + VAT Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#0D1117]">Cash Flow — Last 6 Months</h2>
              <p className="text-xs text-gray-400 mt-0.5">Inflows vs Outflows (KES)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#2563EB]" />
                <span className="text-gray-500">Inflows</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-400" />
                <span className="text-gray-500">Outflows</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cashFlowData} barSize={22} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={fmtShort}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
              <Bar dataKey="inflows"  name="Inflows"  fill="#2563EB" radius={[5, 5, 0, 0]} />
              <Bar dataKey="outflows" name="Outflows" fill="#F87171" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Net Cash summary row */}
          <div className="mt-4 flex gap-3">
            {cashFlowData.slice(-1).map((d) => {
              const net = d.inflows - d.outflows;
              return (
                <div key="net" className="flex-1 flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-emerald-600 font-medium">Net Cash Flow (Jul)</span>
                  <span className="text-sm font-bold text-emerald-700">{fmt(net)}</span>
                </div>
              );
            })}
            <div className="flex-1 flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
              <span className="text-xs text-blue-600 font-medium">Total Inflows (Jul)</span>
              <span className="text-sm font-bold text-[#2563EB]">KES 254,780</span>
            </div>
          </div>
        </div>

        {/* VAT Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText size={16} className="text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0D1117]">VAT Summary</h2>
              <p className="text-xs text-gray-400">July 2026 — 16% VAT</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 flex-1">
            <VATItem
              label="VAT Collected (Output)"
              value={fmt(sales.reduce((sum, s) => sum + (s.tax || 0), 0))}
              sub={`On ${fmt(totalRevenue - sales.reduce((sum, s) => sum + (s.tax || 0), 0))} net sales`}
            />
            <VATItem
              label="VAT on Purchases (Input)"
              value={fmt(cogs * 0.16)}
              sub={`On ${fmt(cogs)} COGS (16%)`}
            />
            <VATItem
              label="VAT Payable to KRA"
              value={fmt(sales.reduce((sum, s) => sum + (s.tax || 0), 0) - (cogs * 0.16))}
              sub="Dynamic Projection"
              highlight
            />
          </div>

          {/* VAT status badge */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Filing Due:</span> 20th of next month.
            </p>
          </div>

          {/* VAT breakdown table */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left text-gray-500 font-semibold">Item</th>
                  <th className="px-3 py-2 text-right text-gray-500 font-semibold">Base</th>
                  <th className="px-3 py-2 text-right text-gray-500 font-semibold">VAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { item: 'Sales',     base: fmtShort(totalRevenue - sales.reduce((sum, s) => sum + (s.tax || 0), 0)), vat: fmtShort(sales.reduce((sum, s) => sum + (s.tax || 0), 0)) },
                  { item: 'Purchases', base: fmtShort(cogs), vat: fmtShort(cogs * 0.16) },
                  { item: 'Net',       base: fmtShort(grossProfit), vat: fmtShort(sales.reduce((sum, s) => sum + (s.tax || 0), 0) - (cogs * 0.16)) },
                ].map((r) => (
                  <tr key={r.item} className={r.item === 'Net' ? 'bg-gray-50 font-bold' : ''}>
                    <td className="px-3 py-2 text-gray-700">{r.item}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{r.base}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${r.item === 'Net' ? 'text-[#2563EB]' : 'text-gray-700'}`}>
                      {r.vat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
