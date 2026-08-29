'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  UserCheck,
  Receipt,
  BarChart2,
  Download,
  RefreshCw,
  CalendarDays,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type DateRange = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'custom';

interface ReportCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  lastGenerated: string;
}

interface PLRow {
  label: string;
  thisMonth: number | null;
  lastMonth: number | null;
  isHeader?: boolean;
  isTotal?: boolean;
  isPositive?: boolean;
  isNegative?: boolean;
  isIndent?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const reportCards: ReportCard[] = [
  {
    id: 'sales',
    icon: <TrendingUp size={22} />,
    title: 'Sales Summary',
    description: 'Revenue, order volume, avg ticket, top products and payment method breakdown',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    lastGenerated: '18 Jul 2026',
  },
  {
    id: 'inventory',
    icon: <Package size={22} />,
    title: 'Inventory Report',
    description: 'Stock levels, low-stock alerts, shrinkage, and reorder recommendations',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    lastGenerated: '17 Jul 2026',
  },
  {
    id: 'customer',
    icon: <Users size={22} />,
    title: 'Customer Report',
    description: 'New vs returning customers, top spenders, loyalty tier distribution',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    lastGenerated: '15 Jul 2026',
  },
  {
    id: 'employee',
    icon: <UserCheck size={22} />,
    title: 'Employee Performance',
    description: 'Sales by cashier, shift analysis, attendance, and productivity metrics',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    lastGenerated: '14 Jul 2026',
  },
  {
    id: 'expense',
    icon: <Receipt size={22} />,
    title: 'Expense Report',
    description: 'Expenditure by category, approved vs pending, month-over-month variance',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    lastGenerated: '18 Jul 2026',
  },
  {
    id: 'pl',
    icon: <BarChart2 size={22} />,
    title: 'P&L Statement',
    description: 'Full profit & loss with COGS, gross margin, operating expenses, and net income',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    lastGenerated: '18 Jul 2026',
  },
];
// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `KES ${Math.abs(n).toLocaleString('en-KE')}`;

// ─── Report Card Component ─────────────────────────────────────────────────────
function ReportCardItem({ card }: { card: ReportCard }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1800);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}>
          {card.icon}
        </div>
        <span className="text-[10px] text-gray-400 mt-1">
          Last: {card.lastGenerated}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-[#0D1117]">{card.title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.description}</p>
      </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setGenerating(true);
              setTimeout(() => setGenerating(false), 800);
            }}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            {generating ? 'Generating...' : 'Generate'}
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 flex-1 justify-center border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Download size={12} />
            Download PDF
          </button>
        </div>
    </div>
  );
}

// ─── P&L Table Row ────────────────────────────────────────────────────────────
function PLTableRow({ row }: { row: PLRow }) {
  if (row.isHeader) {
    return (
      <tr>
        <td colSpan={3} className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
          {row.label}
        </td>
      </tr>
    );
  }

  const delta =
    row.thisMonth !== null && row.lastMonth !== null
      ? row.thisMonth - row.lastMonth
      : null;

  const rowClass = row.isTotal
    ? 'bg-gray-50 border-t-2 border-gray-200'
    : 'hover:bg-gray-50/60';

  const labelClass = row.isTotal
    ? 'font-bold text-[#0D1117]'
    : row.isIndent
    ? 'text-gray-600 pl-8'
    : 'font-medium text-[#0D1117]';

  const getValueColor = (val: number, positive?: boolean, negative?: boolean) => {
    if (negative || val < 0) return 'text-red-600';
    if (positive) return 'text-emerald-600';
    return 'text-[#0D1117]';
  };

  return (
    <tr className={`${rowClass} transition-colors`}>
      <td className={`px-6 py-3 text-sm ${labelClass}`}>{row.label}</td>
      <td className={`px-6 py-3 text-sm font-medium text-right ${row.thisMonth !== null ? getValueColor(row.thisMonth, row.isPositive, row.isNegative) : ''}`}>
        {row.thisMonth !== null
          ? `${row.thisMonth < 0 ? '−' : ''}${fmt(row.thisMonth)}`
          : '—'}
      </td>
      <td className={`px-6 py-3 text-sm font-medium text-right ${row.lastMonth !== null ? getValueColor(row.lastMonth, row.isPositive, row.isNegative) : ''}`}>
        {row.lastMonth !== null
          ? `${row.lastMonth < 0 ? '−' : ''}${fmt(row.lastMonth)}`
          : '—'}
      </td>
      <td className="px-6 py-3 text-sm text-right">
        {delta !== null ? (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${delta >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {delta >= 0 ? '+' : ''}
            {fmt(delta)}
          </span>
        ) : '—'}
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('this_month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  
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

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
  
  const cogs = sales.reduce((sum, s) => {
    if (!s.items) return sum;
    return sum + s.items.reduce((acc: number, item: any) => acc + (item.buyPrice * item.qty), 0);
  }, 0);

  const grossProfit = totalRevenue - cogs;
  
  const expensesByCategory = expenses.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  const plRows: PLRow[] = [
    { label: 'Revenue',               thisMonth: totalRevenue, lastMonth: 0, isHeader: false },
    { label: 'Cost of Goods Sold',    thisMonth: cogs, lastMonth: 0, isNegative: true },
    { label: 'Gross Profit',          thisMonth: grossProfit, lastMonth: 0, isTotal: true },
    { label: 'Operating Expenses',    thisMonth: null,   lastMonth: null,   isHeader: true },
    ...Object.entries(expensesByCategory).map(([cat, amt]) => ({
      label: cat, thisMonth: amt as number, lastMonth: 0, isIndent: true, isNegative: true
    })),
    { label: 'Total Opex',            thisMonth: totalExpenses, lastMonth: 0, isTotal: true, isNegative: true },
    { label: 'Net Profit',            thisMonth: netProfit,   lastMonth: 0,  isTotal: true, isPositive: netProfit >= 0, isNegative: netProfit < 0 },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Generate, download, and analyse business reports</p>
        </div>
        {/* Date range filter */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm p-1 flex-wrap">
            <CalendarDays size={14} className="text-gray-400 ml-2" />
            {[
              { key: 'today', label: 'Today' },
              { key: 'yesterday', label: 'Yesterday' },
              { key: 'this_week', label: 'This Week' },
              { key: 'this_month', label: 'This Month' },
              { key: 'last_month', label: 'Last Month' },
              { key: 'this_quarter', label: 'Quarter' },
              { key: 'this_year', label: 'This Year' },
              { key: 'custom', label: 'Custom' }
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setDateRange(r.key as DateRange)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  dateRange === r.key
                    ? 'bg-[#2563EB] text-white shadow'
                    : 'text-gray-500 hover:text-[#0D1117]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm p-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs text-gray-500 font-medium ml-1">From</label>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#2563EB]" />
              <label className="text-xs text-gray-500 font-medium">To</label>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#2563EB]" />
              <button className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">Apply</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Report Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {reportCards.map((card) => (
          <ReportCardItem key={card.id} card={card} />
        ))}
      </div>

      {/* ── P&L Summary ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0D1117]">Profit & Loss Summary</h2>
            <p className="text-xs text-gray-400 mt-0.5">Month-over-month comparison — KES</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-[#2563EB] hover:underline font-medium">
            <Download size={14} />
            Export P&L
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/2">Line Item</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">This Month</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Month</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plRows.map((row, i) => (
                <PLTableRow key={i} row={row} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <p className="text-xs text-blue-600">
            <span className="font-semibold">Note:</span> All figures in Kenyan Shillings (KES). VAT-exclusive. Generated: 18 Jul 2026 at 10:24 EAT.
          </p>
        </div>
      </div>
    </div>
  );
}
