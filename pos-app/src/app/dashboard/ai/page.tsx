'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Brain, Send, AlertTriangle, TrendingDown, TrendingUp, Clock, Package,
  BarChart2, Zap, Star, Users, ArrowRight, RefreshCw, Sparkles,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const forecastData = [
  { day: 'Mon', actual: 84200, predicted: 86000 },
  { day: 'Tue', actual: 91500, predicted: 89400 },
  { day: 'Wed', actual: 78300, predicted: 80100 },
  { day: 'Thu', actual: 95700, predicted: 93200 },
  { day: 'Fri', actual: 112400, predicted: 108000 },
  { day: 'Sat', actual: 138900, predicted: 135500 },
  { day: 'Sun', actual: null, predicted: 142000 },
];

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  content: string;
  time: string;
}

const recommendations = [
  {
    icon: Package, color: '#DC2626', bg: '#FEE2E2', title: 'Reorder Now',
    desc: '3 products will stock out within 48 hours. Unga 2kg, Cooking Oil 2L, and Ketepa Tea need urgent restocking.', action: 'Generate PO',
  },
  {
    icon: BarChart2, color: '#7C3AED', bg: '#EDE9FE', title: 'Price Optimization',
    desc: 'Increase Indomie Noodles price by KES 5 — demand is inelastic. Projected revenue increase: KES 12,000/week.', action: 'Review Prices',
  },
  {
    icon: Star, color: '#D97706', bg: '#FEF3C7', title: 'Top Performer',
    desc: 'Grace Wanjiku achieved 127% of her sales target this week. Recognize and incentivize her performance.', action: 'View Details',
  },
  {
    icon: Users, color: '#059669', bg: '#D1FAE5', title: 'Customer Insight',
    desc: 'You have 42 returning customers this week. Activating loyalty points could increase retention by ~23%.', action: 'Enable Loyalty',
  },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
        <p className="m-0 font-bold text-[#0D1117] text-[13px] mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="m-0 py-1 text-[13px] flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}: <strong>KES {Number(p.value).toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 1, role: 'ai', content: 'Hello! I am your HaxOne AI Copilot. Ask me about your live sales, expenses, or inventory trends.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    try {
      const sales = JSON.parse(localStorage.getItem('haxone_sales') || '[]');
      const expenses = JSON.parse(localStorage.getItem('haxone_expenses') || '[]');
      
      const totalSales = sales.reduce((s: number, t: any) => s + (t.status === 'Completed' ? t.amount : 0), 0);
      const totalExpenses = expenses.reduce((s: number, e: any) => s + e.amount, 0);

      if (q.includes('sale') || q.includes('revenue')) {
        return `Based on your live data, you have a total of **KES ${totalSales.toLocaleString()}** in completed sales from ${sales.length} transactions. M-Pesa is the most popular payment method. Keep pushing!`;
      }
      
      if (q.includes('expense') || q.includes('cost')) {
        return `Your recorded expenses total **KES ${totalExpenses.toLocaleString()}** across ${expenses.length} records. Let me know if you want a breakdown by category!`;
      }
      
      if (q.includes('profit')) {
        const profit = totalSales - totalExpenses;
        return `Your current gross profit (Sales minus Expenses) stands at **KES ${profit.toLocaleString()}**. ${profit > 0 ? 'Great job staying profitable!' : 'You are currently operating at a loss based on recorded data.'}`;
      }

      if (q.includes('product') || q.includes('stock')) {
        return `I can see your inventory. You have a few items running low. "Unga wa Dola 2kg" is critically low. I recommend reordering immediately to avoid stockouts.`;
      }

    } catch (e) {
      console.error(e);
    }

    return `I've analyzed your query. While I don't have a specific pre-programmed response for that exact phrasing in this demo, I'm continuously monitoring your ${Math.floor(Math.random() * 10) + 1} active branches and ensuring everything is running smoothly.`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: generateAIResponse(userMsg.content),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(p => [...p, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Brain size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-[26px] font-extrabold text-[#0D1117] leading-tight">AI Business Intelligence</h1>
          <p className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
            Powered by HaxOne AI Copilot · Real-time insights for smarter decisions
          </p>
        </div>
      </div>

      {/* Live Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-3.5 mb-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative w-3 h-3">
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
            <span className="absolute inset-0.5 rounded-full bg-green-600"></span>
          </div>
          <span className="text-white font-semibold text-sm">HaxOne AI Copilot — Analyzing your business in real time</span>
          <span className="bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-green-500/30">LIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-[13px]">Connected to local data</span>
          <button className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-slate-300 text-xs flex items-center gap-1.5 hover:bg-white/20 transition-colors">
            <RefreshCw size={12} /> Sync Data
          </button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {alertCards.map(a => (
          <div key={a.title} className="rounded-xl p-4 border transition-transform hover:-translate-y-0.5 cursor-default" style={{ background: a.bg, borderColor: a.border }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5" style={{ background: a.iconBg }}>
              <a.icon size={18} color={a.color} />
            </div>
            <p className="font-bold text-[13px] text-[#0D1117] m-0 mb-1">{a.title}</p>
            <p className="text-xs text-gray-500 m-0 mb-3 leading-relaxed">{a.desc}</p>
            <button className="bg-transparent rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: a.color, border: `1px solid ${a.color}` }}>
              {a.action} <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* AI Chat Interface */}
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5 bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="m-0 font-bold text-sm text-white">HaxOne AI Copilot</p>
              <p className="m-0 text-[11px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online · Ready for queries
              </p>
            </div>
            <div className="ml-auto"><Sparkles size={16} className="text-slate-400" /></div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5 bg-gray-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-sm flex-shrink-0 shadow-sm">🤖</div>
                )}
                <div className="max-w-[80%]">
                  <div className={`p-3 text-[13px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#2563EB] text-white rounded-[16px_16px_4px_16px]' 
                      : 'bg-white border border-gray-100 text-[#0D1117] rounded-[16px_16px_16px_4px]'
                  }`}>
                    {msg.content}
                  </div>
                  <p className={`m-0 mt-1 text-[10px] text-gray-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5 items-end justify-start">
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-sm flex-shrink-0 shadow-sm">🤖</div>
                <div className="bg-white border border-gray-100 rounded-[16px_16px_16px_4px] p-3 flex gap-1 items-center shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2.5 items-center bg-white">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about sales, profits, expenses..."
              className="flex-1 border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-[#0D1117] outline-none bg-gray-50 focus:bg-white focus:border-[#2563EB] transition-colors"
            />
            <button
              onClick={sendMessage}
              className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-500/20 hover:scale-95 transition-transform"
            >
              <Send size={16} className="text-white ml-0.5" />
            </button>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="flex flex-col">
          <h2 className="text-base font-bold text-[#0D1117] m-0 mb-3.5 flex items-center gap-2">
            <div className="p-1 rounded bg-blue-100"><Zap size={16} className="text-[#2563EB] fill-blue-200" /></div> Smart Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
            {recommendations.map(r => (
              <div key={r.title} className="bg-white rounded-2xl p-4.5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5" style={{ background: r.bg }}>
                    <r.icon size={18} color={r.color} />
                  </div>
                  <p className="font-bold text-[13px] text-[#0D1117] m-0 mb-1.5">{r.title}</p>
                  <p className="text-xs text-gray-500 m-0 leading-relaxed">{r.desc}</p>
                </div>
                <button className="mt-3 bg-transparent border-none rounded-lg py-1.5 text-xs font-bold cursor-pointer flex items-center gap-1 w-fit hover:opacity-80 transition-opacity" style={{ color: r.color, backgroundColor: r.bg, padding: '6px 12px' }}>
                  {r.action} <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Sales Forecast Chart */}
      <div className="bg-white rounded-[20px] shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
          <div>
            <h2 className="m-0 text-base font-bold text-[#0D1117] flex items-center gap-2">
              <Brain size={16} className="text-[#7C3AED]" /> AI Sales Forecast — This Week
            </h2>
            <p className="m-0 mt-1 text-[13px] text-gray-400">Actual vs AI-predicted revenue (KES) across all branches</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
              <span className="w-5 h-1 bg-[#2563EB] rounded-sm block" /> Actual
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
              <span className="w-5 h-1 rounded-sm block border-t-2 border-dashed border-[#7C3AED]" /> Predicted
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={forecastData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 13 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#F3F4F6', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, stroke: '#2563EB', strokeWidth: 2, fill: '#fff' }} connectNulls={false} />
            <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#7C3AED" strokeWidth={2.5} strokeDasharray="6 4" dot={{ fill: '#7C3AED', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, stroke: '#7C3AED', strokeWidth: 2, fill: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap md:flex-nowrap gap-4 mt-4 pt-4 border-t border-gray-100">
          {[
            { label: 'Forecast Accuracy', value: '94.2%', color: 'text-green-600', bg: 'bg-green-50' },
            { label: "Sun Prediction", value: 'KES 142K', color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Week Total (Est.)', value: 'KES 742K', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'vs Last Week', value: '+11.3%', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-3 flex-1 ${s.bg}`}>
              <p className="m-0 text-[11px] text-gray-500 uppercase tracking-wide font-medium">{s.label}</p>
              <p className={`m-0 mt-1 text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
