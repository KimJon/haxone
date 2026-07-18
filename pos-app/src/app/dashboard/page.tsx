"use client";
import { ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { time: '6AM', sales: 10000 },
  { time: '9AM', sales: 25000 },
  { time: '12PM', sales: 45000 },
  { time: '3PM', sales: 60000 },
  { time: '6PM', sales: 42000 },
  { time: '9PM', sales: 30000 },
];

const paymentData = [
  { name: 'M-Pesa', value: 48, color: '#2563EB' },
  { name: 'Cash', value: 32, color: '#7C3AED' },
  { name: 'Cards', value: 20, color: '#F59E0B' },
];

const topProducts = [
  { id: 1, name: 'Coca Cola 500ml', stock: '284 pcs', sales: 'KES 85,200', image: '🥤' },
  { id: 2, name: 'Soko Maize Meal 2kg', stock: '192 pcs', sales: 'KES 57,600', image: '🌽' },
  { id: 3, name: 'Brookside Milk 1L', stock: '156 pcs', sales: 'KES 46,800', image: '🥛' },
  { id: 4, name: 'Blue Band 500g', stock: '132 pcs', sales: 'KES 39,600', image: '🧈' },
  { id: 5, name: 'Dettol Soap', stock: '120 pcs', sales: 'KES 28,800', image: '🧼' },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your business today</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer shadow-sm">
          <span>Today</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-sm text-gray-500 font-medium">Total Sales</div>
          <div>
            <div className="text-2xl font-bold text-[#0D1117]">KES 254,780</div>
            <div className="flex items-center text-sm mt-1 text-[#10B981] font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              12.5% <span className="text-gray-400 ml-1 font-normal">vs yesterday</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-sm text-gray-500 font-medium">Transactions</div>
          <div>
            <div className="text-2xl font-bold text-[#0D1117]">1,482</div>
            <div className="flex items-center text-sm mt-1 text-[#10B981] font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              8.3%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-sm text-gray-500 font-medium">Profit</div>
          <div>
            <div className="text-2xl font-bold text-[#0D1117]">KES 78,450</div>
            <div className="flex items-center text-sm mt-1 text-[#10B981] font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              14.2%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
          <div className="text-sm text-gray-500 font-medium">Low Stock</div>
          <div>
            <div className="text-2xl font-bold text-[#EF4444]">24</div>
            <div className="flex items-center text-sm mt-1 text-[#EF4444] font-medium">
              <ArrowDown className="w-4 h-4 mr-1" />
              needs restocking
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[#0D1117]">Sales Trend</h2>
            <div className="text-sm text-gray-500 border border-gray-200 px-3 py-1 rounded-md cursor-pointer">
              This Week
            </div>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dx={-10} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`KES ${Number(value).toLocaleString()}`, 'Sales']}
                />
                <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#0D1117]">Top Products</h2>
            <div className="text-sm text-gray-500 cursor-pointer">Today</div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 font-medium w-3">{i + 1}</span>
                  <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-lg">{product.image}</div>
                  <div>
                    <div className="text-sm font-semibold text-[#0D1117]">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.stock}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-[#0D1117]">{product.sales}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px]">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="font-bold text-[#0D1117] mb-6">Sales by Payment Method</h2>
          <div className="flex-1 flex items-center justify-between px-8">
            <div className="w-48 h-48 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-500">Total</span>
                  <span className="font-bold text-lg text-[#0D1117]">100%</span>
                </div>
            </div>
            
            <div className="space-y-4 flex-1 ml-10">
              {paymentData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#0D1117]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="font-bold text-[#0D1117] mb-6">Recent Activity</h2>
          <div className="flex-1 flex flex-col justify-center items-center text-gray-400 space-y-2">
             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                <MoreHorizontal className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-sm">Activity feed will appear here</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
